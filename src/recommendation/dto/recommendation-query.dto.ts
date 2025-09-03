import { IsOptional, IsArray, IsNumber, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class RecommendationQueryDto {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      const result = value.map(Number).filter((num) => !isNaN(num));
      return result;
    }
    if (typeof value === 'string') {
      const result = value
        .split(',')
        .map((str) => parseInt(str.trim(), 10))
        .filter((num) => !isNaN(num));
      return result;
    }
    if (typeof value === 'number' && !isNaN(value)) {
      const result = [value];
      return result;
    }
    return [];
  })
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
