import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateMealDishFoodItemDto {
  @IsInt()
  mealId: number;

  @IsInt()
  dishId: number;

  @IsInt()
  foodItemId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  quantity: number;

  @IsString()
  @MaxLength(20)
  unit: string;
}
