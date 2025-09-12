import { Injectable } from '@nestjs/common';
import {
  MacroVector,
  RecommendationDto,
  RecommendationResponseDto,
  IngredientOverride,
} from './dto/recommendation.dto';
import { RecommendationQueryDto } from './dto/recommendation-query.dto';
import { DishFoodItem } from '../dishFoodItem/dishFoodItem.entity';
import { DishService } from 'src/dish/dish.service';
import { MealService } from 'src/meal/meal.service';

interface DishVector {
  dishId: number;
  macros: MacroVector;
  ingredients: Array<{ ingredientId: number; baseGrams: number }>;
}

interface ScaleResult {
  s: number;
  score: number;
}

@Injectable()
export class RecommendationService {
  // Energy weights for error calculation
  private readonly MACRO_WEIGHTS = {
    protein: 4,
    carbs: 4,
    fat: 9,
  };

  constructor(
    private readonly mealService: MealService,

    private readonly dishService: DishService,
  ) {}

  /**
   * Calculates optimal scale factor and resulting error
   * Implements formula: s* = (P·R)/(P·P) with constraints
   */
  computeScaleAndError(
    R: MacroVector,
    P: MacroVector,
    opts: { sMin: number; sMax: number },
  ): ScaleResult {
    const w = this.MACRO_WEIGHTS;

    // Weighted dot products
    const dotPR =
      w.protein * P.protein * R.protein +
      w.carbs * P.carbs * R.carbs +
      w.fat * P.fat * R.fat;

    const dotPP =
      w.protein * P.protein * P.protein +
      w.carbs * P.carbs * P.carbs +
      w.fat * P.fat * P.fat;

    // If weighted P·P <= 1e-9, dish has no valid macros (numerical robustness)
    if (dotPP <= 1e-9) {
      return { s: 0, score: Infinity };
    }

    // Optimal weighted scale factor
    const sOptimal = dotPR / dotPP;

    // Apply scale constraints
    const s = Math.max(opts.sMin, Math.min(opts.sMax, sOptimal));

    // Calculate weighted error: E(s) = Σ_i w_i · (s·P_i − R_i)²
    const eProt = s * P.protein - R.protein;
    const eCarb = s * P.carbs - R.carbs;
    const eFat = s * P.fat - R.fat;
    const score =
      w.protein * eProt * eProt + w.carbs * eCarb * eCarb + w.fat * eFat * eFat;

    return { s, score };
  }

  /**
   * Finds the best dish for remaining macros
   * Evaluates all dishes and returns the one with lowest error
   */
  private recommendDish(
    dishVectors: DishVector[],
    remaining: MacroVector,
    sMin = 0.5,
    sMax = 2.5,
    recentlyConsumedDishes?: Map<number, number>,
  ): { dishVector: DishVector; s: number; score: number } | null {
    let bestDishVector: DishVector | null = null;
    let bestS = 0;
    let bestScore = Infinity;

    for (const dishVector of dishVectors) {
      const scaleResult = this.computeScaleAndError(
        remaining,
        dishVector.macros,
        { sMin, sMax },
      );

      // Apply diversity penalty for recently consumed dishes
      let finalScore = scaleResult.score;
      let diversityInfo = 'No recent consumption';

      if (
        recentlyConsumedDishes &&
        recentlyConsumedDishes.has(dishVector.dishId)
      ) {
        const frequency = recentlyConsumedDishes.get(dishVector.dishId) || 0;
        // Apply penalty: 20% increase in score per recent consumption
        const diversityPenalty = frequency * 0.2;
        finalScore = scaleResult.score * (1 + diversityPenalty);
        diversityInfo = `Consumed ${frequency} times, penalty: ${diversityPenalty.toFixed(2)}, final score: ${finalScore.toFixed(2)}`;
      } else {
      }
      const scaledProtein = dishVector.macros.protein * scaleResult.s;
      if (finalScore < bestScore && scaledProtein >= 5) {
        //Lower score, better adjustment
        bestDishVector = dishVector;
        bestS = scaleResult.s;
        bestScore = finalScore;
      }
    }

    if (bestDishVector) {
    } else {
    }

    return bestDishVector
      ? { dishVector: bestDishVector, s: bestS, score: bestScore }
      : null;
  }

  /**
   * Rounds grams to specified multiple
   * Implements ingredient rounding according to rules
   */
  private roundGrams(grams: number, roundTo: number): number {
    return Math.round(grams / roundTo) * roundTo;
  }

  /**
   * Recalculates final macros from rounded overrides
   * Ensures consistency between what is shown and what is saved
   */
  private computeMacrosFromOverrides(
    overrides: IngredientOverride[],
    byId: Record<number, { protein: number; carbs: number; fat: number }>,
  ): MacroVector {
    const result = overrides.reduce(
      (acc, ovr) => {
        const m = byId[ovr.ingredientId];
        if (!m) {
          return acc;
        }
        const factor = ovr.grams / 100;
        acc.protein += m.protein * factor;
        acc.carbs += m.carbs * factor;
        acc.fat += m.fat * factor;
        return acc;
      },
      { protein: 0, carbs: 0, fat: 0, kcal: 0 },
    );

    // Calculate kcal from macros
    result.kcal = result.protein * 4 + result.carbs * 4 + result.fat * 9;

    return result;
  }

  /**
   * Gets complete recommendation for a user, date and meal type
   * Integrates entire flow with diagnostic information
   */
  async getRecommendationWithDiagnostics(
    userId: number,
    date: string,
    queryDto: RecommendationQueryDto,
  ): Promise<RecommendationResponseDto> {
    const remaining = {
      protein: queryDto.remainingProtein || 0,
      carbs: queryDto.remainingCarbs || 0,
      fat: queryDto.remainingFat || 0,
      kcal: queryDto.remainingKcal || 0,
    };

    // Early-return if remaining macros are almost zero (day practically fulfilled)
    if (remaining.protein <= 1 && remaining.carbs <= 1 && remaining.fat <= 1) {
      return {
        recommendation: undefined,
        diagnostics: {
          remainingMacros: remaining,
          availableDishes: 0,
          filteredDishes: 0,
          reason: 'Daily macros are practically fulfilled (≤ 1g remaining)',
        },
      };
    }

    // Get all available dishes with their ingredients using QueryBuilder
    const dishes =
      await this.dishService.getDishesWithIngredientsByUser(userId);

    // Create ingredient map by ID for macro recalculation
    const ingredientMacrosById: Record<
      number,
      { protein: number; carbs: number; fat: number }
    > = {};
    dishes.forEach((dish) => {
      dish.dishFoodItems.forEach((item: DishFoodItem) => {
        ingredientMacrosById[item.foodItem.barcode] = {
          protein: item.foodItem.proteins,
          carbs: item.foodItem.carbohydrates,
          fat: item.foodItem.fat,
        };
      });
    });

    // Convert dishes to macro vectors
    const dishVectors: DishVector[] = dishes.map((dish) => {
      const macros = dish.dishFoodItems.reduce(
        (acc: MacroVector, item: DishFoodItem) => {
          const factor = item.quantity / 100;
          acc.protein += item.foodItem.proteins * factor;
          acc.carbs += item.foodItem.carbohydrates * factor;
          acc.fat += item.foodItem.fat * factor;
          return acc;
        },
        { protein: 0, carbs: 0, fat: 0, kcal: 0 },
      );

      // Calculate kcal from macros
      macros.kcal = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;

      const ingredients = dish.dishFoodItems.map((item: DishFoodItem) => ({
        ingredientId: item.foodItem.barcode,
        baseGrams: item.quantity,
      }));

      return {
        dishId: dish.id,
        macros,
        ingredients,
      };
    });

    // Filter dishes according to criteria
    let filteredDishes = dishVectors;
    if (queryDto.exclude && queryDto.exclude.length > 0) {
      filteredDishes = dishVectors.filter(
        (dish) => !queryDto.exclude!.includes(dish.dishId),
      );
    }

    // Get recently consumed dishes for diversity (last 7 days)
    const recentlyConsumedDishes = await this.getRecentlyConsumedDishes(
      userId,
      date,
      7,
    );

    // Find the best dish
    const bestDish = this.recommendDish(
      filteredDishes,
      remaining,
      queryDto.sMin || 0.5,
      queryDto.sMax || 2.5,
      recentlyConsumedDishes,
    );

    let recommendation: RecommendationDto | undefined;
    let reason: string | undefined;

    if (bestDish) {
      // Generate overrides with rounded grams
      const overrides: IngredientOverride[] =
        bestDish.dishVector.ingredients.map((ingredient) => {
          const scaledQuantity = ingredient.baseGrams * bestDish.s;
          const roundedQuantity = this.roundGrams(
            scaledQuantity,
            queryDto.roundGramsTo || 5,
          );
          // Ensure minimum of 1g if base quantity is > 0
          const finalQuantity =
            ingredient.baseGrams > 0 && roundedQuantity === 0
              ? 1
              : roundedQuantity;

          return {
            ingredientId: ingredient.ingredientId,
            grams: finalQuantity,
          };
        });

      // Calculate scaled macros from rounded overrides for consistency
      const scaledMacros = this.computeMacrosFromOverrides(
        overrides,
        ingredientMacrosById,
      );

      recommendation = {
        dishId: bestDish.dishVector.dishId,
        scale: bestDish.s,
        score: bestDish.score,
        overrides,
        macros: scaledMacros,
      };
    } else {
      // Determine the reason why there is no recommendation
      if (dishes.length === 0) {
        reason = 'No dishes available in database';
      } else if (filteredDishes.length === 0) {
        reason = 'All dishes were excluded by filters';
      } else if (
        remaining.protein <= 0 &&
        remaining.carbs <= 0 &&
        remaining.fat <= 0
      ) {
        reason = 'All daily macros have already been reached';
      } else {
        reason = 'Unexpected error: could not select any dish';
      }
    }

    return {
      recommendation,
      diagnostics: {
        remainingMacros: remaining,
        availableDishes: dishes.length,
        filteredDishes: filteredDishes.length,
        reason,
      },
    };
  }

  /**
   * Gets recently consumed dishes for diversity calculation
   * Returns a map of dishId -> frequency count
   */
  private async getRecentlyConsumedDishes(
    userId: number,
    currentDate: string,
    daysBack: number = 7,
  ): Promise<Map<number, number>> {
    const endDate = new Date(currentDate);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - daysBack);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Query to get all dishes consumed in the last N days
    const consumedDishes = await this.mealService.getRecentlyConsumedDishes(
      userId,
      daysBack,
    );

    // Count frequency of each dish
    const dishFrequency = new Map<number, number>();

    consumedDishes.forEach((meal) => {
      if (meal.mealDishes && Array.isArray(meal.mealDishes)) {
        meal.mealDishes.forEach((mealDish) => {
          if (mealDish.dish && mealDish.dish.id) {
            const dishId = mealDish.dish.id;
            const currentCount = dishFrequency.get(dishId) || 0;
            dishFrequency.set(dishId, currentCount + 1);
          }
        });
      }
    });

    return dishFrequency;
  }
}
