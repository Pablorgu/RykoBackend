import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealDishFooditem } from './mealDishFoodItem.entity';
import { CreateMealDishFoodItemDto } from './dto/createMealDishFoodItem.dto';
import { UpdateMealDishFoodItemDto } from './dto/queryMealDishFoodItem.dto';
import { MealService } from 'src/meal/meal.service';
import { DishService } from 'src/dish/dish.service';
import { FoodItemService } from 'src/foodItem/fooditem.service';

@Injectable()
export class MealDishFoodItemService {
  constructor(
    @InjectRepository(MealDishFooditem)
    private readonly repository: Repository<MealDishFooditem>,
    private readonly mealService: MealService,
    private readonly dishService: DishService,
    private readonly foodItemService: FoodItemService,
  ) {}
}
