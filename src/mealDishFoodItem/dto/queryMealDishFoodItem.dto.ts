import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateMealDishFoodItemDto {
  @IsOptional()
  @IsInt()
  mealId?: number;

  @IsOptional()
  @IsInt()
  dishId?: number;

  @IsOptional()
  @IsInt()
  foodItemId?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;
}

