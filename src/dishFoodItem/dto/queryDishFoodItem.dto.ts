import { IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDishFoodItemDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  dishId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  foodItemId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;
}
