import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMealDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  dayId: number;
}