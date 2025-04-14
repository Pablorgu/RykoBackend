import { IsOptional, IsInt, IsString, IsNumber } from 'class-validator';

export class QueryPantryDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  foodItemId?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  quantityToBuy?: number;

  @IsOptional()
  @IsString()
  unit?: string;
}
