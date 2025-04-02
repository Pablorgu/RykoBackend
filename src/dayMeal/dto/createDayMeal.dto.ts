import { IsInt } from 'class-validator';

export class CreateDayMealDto {
  @IsInt()
  dayId: number;

  @IsInt()
  mealId: number;
}
