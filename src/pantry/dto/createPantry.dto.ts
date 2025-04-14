import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePantryDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  foodItemId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  quantityToBuy: number;

  @IsNotEmpty()
  @IsString()
  unit: string;
}
