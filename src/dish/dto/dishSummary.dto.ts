export class DishSummaryDto {
  id: string;
  name: string;
  imageUrl?: string;
  nutrients: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    satFat?: number;
  };
}

export class NutrientsDto {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  satFat?: number;
}