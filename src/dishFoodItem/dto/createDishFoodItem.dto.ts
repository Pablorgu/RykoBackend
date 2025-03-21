import { IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

export class CreateDishFoodItemDto {
  @IsNumber()
  @IsPositive()
  dishId: number; // Dish identifier

  @IsNumber()
  @IsPositive()
  foodItemId: number; // Food item identifier

  @IsNumber()
  @IsPositive()
  quantity: number; // Amount of the food item in the dish

  @IsString()
  @IsOptional()
  unit?: string; // Measurement unit (optional)
}
