import { IsOptional, IsArray, IsNumber, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class RecommendationQueryDto {
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @Transform(({ value }) => Array.isArray(value) ? value : value?.split(',').map(Number))
  exclude?: number[];

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(5)
  @Type(() => Number)
  sMin?: number = 0.5;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(10)
  @Type(() => Number)
  sMax?: number = 2.5;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  roundGramsTo?: number = 5;
}