
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateMealDto {
  @IsString()
  @IsNotEmpty()
  time: string;

  @IsInt()
  @IsNotEmpty()
  MealTypeId: number;
}
