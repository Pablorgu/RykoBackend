import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMealDishDto {
  @IsNotEmpty()
  @IsNumber()
  dayMealId: number;

  @IsNotEmpty()
  @IsNumber()
  dishId: number;
}