import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealDish } from './mealDish.entity';
import { CreateMealDishDto } from './dto/createMealDish.dto';

@Injectable()
export class MealDishService {
  constructor(
    @InjectRepository(MealDish)
    private readonly mealDishRepository: Repository<MealDish>,
  ) {}
}
