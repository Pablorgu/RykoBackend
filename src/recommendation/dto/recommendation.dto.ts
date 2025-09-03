export interface MacroVector {
  protein: number;
  carbs: number;
  fat: number;
  kcal: number;
}

export interface IngredientOverride {
  ingredientId: number;
  grams: number;
}

export class RecommendationDto {
  dishId: number;
  scale: number;
  score: number;
  overrides: IngredientOverride[];
  macros: MacroVector;
}

export class RecommendationResponseDto {
  recommendation?: RecommendationDto;
  diagnostics: {
    remainingMacros: MacroVector;
    availableDishes: number;
    filteredDishes: number;
    reason?: string;
  };
}
