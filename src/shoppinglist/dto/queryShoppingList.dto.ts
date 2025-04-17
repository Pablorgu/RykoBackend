import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryShoppingDto {
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
  @IsString()
  unit?: string;
}
