import { PartialType } from '@nestjs/mapped-types';
import { CreateMealDishDto } from './createMealDish.dto';

export class UpdateMealDishDto extends PartialType(CreateMealDishDto) {}