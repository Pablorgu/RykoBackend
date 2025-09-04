import { PartialType } from '@nestjs/mapped-types';
import { CreateMealDto } from './createmeal.dto';

export class UpdateMealDto extends PartialType(CreateMealDto) {}
