
import { IsOptional, IsString, IsInt } from "class-validator";

export class QueryMealDto {
  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsInt()
  MealTypeId?: number;
}
