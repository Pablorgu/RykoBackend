import { IsOptional, IsInt } from 'class-validator';

export class QueryDayMealDto {
  @IsOptional()
  @IsInt()
  day?: number;

  @IsOptional()
  @IsInt()
  meal?: number;
}
