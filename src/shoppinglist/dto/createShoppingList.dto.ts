import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateShoppingDto {
  @IsInt()
  userId: number;

  @IsInt()
  foodItemId: number;

  @IsNumber()
  quantity: number;

  @IsString()
  unit: string;
}
