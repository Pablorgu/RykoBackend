import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

class IngredientDto {
  @IsNumber()
  @IsPositive()
  barcode: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsOptional()
  unit?: string;
}

export class CreateDishWithIngredientsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description?: string;

  @ValidateIf((o) => o.image !== '')
  @IsUrl()
  @IsString()
  image?: string;

  @IsInt()
  @IsNotEmpty()
  UserId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];
}
