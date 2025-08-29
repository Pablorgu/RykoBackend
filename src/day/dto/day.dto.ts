import { MealTime } from 'src/meal/enums/mealTime.enum';

export class MealDishIngredientOverrideDto {
  ingredientId: number;
  grams: number;
}

export class MealItemDto {
  mealDishId: number;
  dishId: number;
  overrides: MealDishIngredientOverrideDto[];
}

export class MealDto {
  type: MealTime; // breakfast | lunch | snack | dinner | appetizers
  items: MealItemDto[];
}

export class DayDto {
  id: number;
  date: string; // "YYYY-MM-DD"
  meals: MealDto[];
}
