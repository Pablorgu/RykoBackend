import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from '../meal/meal.entity';
import { Dish } from '../dish/dish.entity';
import { Day } from '../day/day.entity';
import { User } from '../user/user.entity';
import {
  MacroVector,
  RecommendationDto,
  RecommendationResponseDto,
  IngredientOverride,
} from './dto/recommendation.dto';
import { RecommendationQueryDto } from './dto/recommendation-query.dto';
import { MealTime } from '../meal/enums/mealTime.enum';
import { MealDish } from '../mealDish/mealDish.entity';
import { DishFoodItem } from '../dishFoodItem/dishFoodItem.entity';
import { MealDishFooditem } from '../mealDishFoodItem/mealDishFoodItem.entity';

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
    @InjectRepository(Meal)
    private mealRepository: Repository<Meal>,
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    @InjectRepository(DishFoodItem)
    private dishFoodItemRepository: Repository<DishFoodItem>,
    @InjectRepository(Day)
    private dayRepository: Repository<Day>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Calculates daily macro targets from user profile
   */
  private async calculateDailyTargets(userId: number): Promise<MacroVector> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !user.calorieGoal) {
      // Default values if no profile is configured
      return { protein: 150, carbs: 250, fat: 60 };
    }

    const totalCalories = user.calorieGoal;
    const proteinPct = user.proteinPct || 30;
    const carbsPct = user.carbsPct || 45;
    const fatPct = user.fatPct || 25;

    // Calculate macro grams from calories and percentages
    // Protein: 4 kcal/g, Carbohydrates: 4 kcal/g, Fat: 9 kcal/g
    const proteinCalories = (totalCalories * proteinPct) / 100;
    const carbsCalories = (totalCalories * carbsPct) / 100;
    const fatCalories = (totalCalories * fatPct) / 100;

    return {
      protein: Math.round(proteinCalories / 4),
      carbs: Math.round(carbsCalories / 4),
      fat: Math.round(fatCalories / 9),
    };
  }

  /**
   * Calculates remaining macros for a specific day
   */
  async getRemainingForDay(userId: number, date: string): Promise<MacroVector> {
    const day = await this.dayRepository.findOne({
      where: { user: { id: userId }, date },
      relations: [
        'meals',
        'meals.mealDishes',
        'meals.mealDishes.dish',
        'meals.mealDishes.foodItems',
        'meals.mealDishes.foodItems.foodItem',
      ],
    });

    const meals = day?.meals || [];

    // Get daily targets from user profile
    const dailyTargets = await this.calculateDailyTargets(userId);

    const consumed = meals.reduce(
      (acc: MacroVector, meal) => {
        // Validate that meal.mealDishes exists
        if (!meal.mealDishes || !Array.isArray(meal.mealDishes)) {
          return acc;
        }

        const mealMacros = meal.mealDishes.reduce(
          (mealAcc: MacroVector, mealDish: MealDish) => {
            // Validate that mealDish.dish and mealDish.dish.dishFoodItems exist
            if (
              !mealDish.dish ||
              !mealDish.dish.dishFoodItems ||
              !Array.isArray(mealDish.dish.dishFoodItems)
            ) {
              return mealAcc;
            }

            const dishMacros = mealDish.dish.dishFoodItems.reduce(
              (dishAcc: MacroVector, item: DishFoodItem) => {
                const foodItem = item.foodItem;
                const quantity = item.quantity / 100; // Convert to per 100g

                return {
                  protein: dishAcc.protein + foodItem.proteins * quantity,
                  carbs: dishAcc.carbs + foodItem.carbohydrates * quantity,
                  fat: dishAcc.fat + foodItem.fat * quantity,
                };
              },
              { protein: 0, carbs: 0, fat: 0 },
            );

            // Add overrides from mealDishFoodItems if they exist
            mealDish.foodItems?.forEach((item: MealDishFooditem) => {
              const foodItem = item.foodItem;
              const quantity = item.quantity / 100;
              dishMacros.protein += foodItem.proteins * quantity;
              dishMacros.carbs += foodItem.carbohydrates * quantity;
              dishMacros.fat += foodItem.fat * quantity;
            });

            return {
              protein: mealAcc.protein + dishMacros.protein,
              carbs: mealAcc.carbs + dishMacros.carbs,
              fat: mealAcc.fat + dishMacros.fat,
            };
          },
          { protein: 0, carbs: 0, fat: 0 },
        );

        return {
          protein: acc.protein + mealMacros.protein,
          carbs: acc.carbs + mealMacros.carbs,
          fat: acc.fat + mealMacros.fat,
        };
      },
      { protein: 0, carbs: 0, fat: 0 },
    );

    return {
      protein: Math.max(0, dailyTargets.protein - consumed.protein),
      carbs: Math.max(0, dailyTargets.carbs - consumed.carbs),
      fat: Math.max(0, dailyTargets.fat - consumed.fat),
    };
  }

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
    remaining: { protein: number; carbs: number; fat: number },
    sMin = 0.5,
    sMax = 2.5,
  ): { dishVector: DishVector; s: number; score: number } | null {
    let bestDishVector: DishVector | null = null;
    let bestS = 0;
    let bestScore = -Infinity;

    for (const dishVector of dishVectors) {
      const scaleResult = this.computeScaleAndError(
        remaining,
        dishVector.macros,
        { sMin, sMax },
      );

      const scaledProtein = dishVector.macros.protein * scaleResult.s;
      if (scaleResult.score > bestScore && scaledProtein >= 5) {
        bestDishVector = dishVector;
        bestS = scaleResult.s;
        bestScore = scaleResult.score;
      }
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
    return overrides.reduce(
      (acc, ovr) => {
        const m = byId[ovr.ingredientId];
        if (!m) {
          console.warn(
            `Ingredient with ID ${ovr.ingredientId} not found in map`,
          );
          return acc;
        }
        const factor = ovr.grams / 100;
        acc.protein += m.protein * factor;
        acc.carbs += m.carbs * factor;
        acc.fat += m.fat * factor;
        return acc;
      },
      { protein: 0, carbs: 0, fat: 0 } as MacroVector,
    );
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
    // Get remaining macros for the day
    const remaining = await this.getRemainingForDay(userId, date);

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

    // Get all available dishes with their ingredients
    const dishes = await this.dishRepository.find({
      where: { UserId: userId },
      relations: ['dishFoodItems', 'dishFoodItems.foodItem'],
    });

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
        { protein: 0, carbs: 0, fat: 0 },
      );

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

    // Find the best dish
    const bestDish = this.recommendDish(
      filteredDishes,
      remaining,
      queryDto.sMin || 0.5,
      queryDto.sMax || 2.5,
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
   * Integrates entire flow: remaining macros → best dish → overrides
   */
  async getRecommendation(
    userId: number,
    date: string,
    queryDto: RecommendationQueryDto,
  ): Promise<RecommendationDto | null> {
    // Get remaining macros for the day
    const remaining = await this.getRemainingForDay(userId, date);

    // Early-return if remaining macros are almost zero (day practically fulfilled)
    if (remaining.protein <= 1 && remaining.carbs <= 1 && remaining.fat <= 1) {
      return null;
    }

    // Get all available dishes with their ingredients
    const dishes = await this.dishRepository.find({
      where: { UserId: userId },
      relations: ['dishFoodItems', 'dishFoodItems.foodItem'],
    });

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
        { protein: 0, carbs: 0, fat: 0 },
      );

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

    // Filter dishes according to user criteria
    const filteredDishes = dishVectors.filter((dishVector) => {
      // Additional filters can be added here according to queryDto
      return (
        dishVector.macros.protein > 0 ||
        dishVector.macros.carbs > 0 ||
        dishVector.macros.fat > 0
      );
    });

    if (filteredDishes.length === 0) {
      return null;
    }

    // Find the best dish
    const bestDish = this.recommendDish(filteredDishes, remaining, 0.5, 2.5);

    if (!bestDish) {
      return null;
    }

    // Get original dish to access dishFoodItems
    const originalDish = dishes.find(
      (d) => d.id === bestDish.dishVector.dishId,
    );
    if (!originalDish) {
      return null;
    }

    // Calculate rounded overrides with minimum for critical ingredients
    const overrides: IngredientOverride[] = bestDish.dishVector.ingredients.map(
      (ingredient) => ({
        ingredientId: ingredient.ingredientId,
        grams: Math.max(1, Math.round(ingredient.baseGrams * bestDish.s)),
      }),
    );

    // Calculate scaled macros from rounded overrides for consistency
    const scaledMacros = this.computeMacrosFromOverrides(
      overrides,
      ingredientMacrosById,
    );

    return {
      dishId: bestDish.dishVector.dishId,
      scale: bestDish.s,
      score: bestDish.score,
      overrides,
      macros: scaledMacros,
    };
  }
}
