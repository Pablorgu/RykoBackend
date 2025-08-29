import { PartialType } from '@nestjs/mapped-types';
import { CreateMealDto } from './createMeal.dto';

export class UpdateMealDto extends PartialType(CreateMealDto) {}