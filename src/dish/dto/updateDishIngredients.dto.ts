import {
  IsArray,
  ValidateNested,
  IsString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class IngredientUpdateDto {
  @IsString()
  @IsNotEmpty()
  barcode: string;

  @IsNumberString()
  quantity: number;

  @IsString()
  @IsOptional()
  unit?: string;
}

export class UpdateDishIngredientsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientUpdateDto)
  ingredients: IngredientUpdateDto[];
}
