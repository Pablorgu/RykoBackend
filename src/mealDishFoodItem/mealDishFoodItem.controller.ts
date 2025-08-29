import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MealDishFoodItemService } from './mealDishFoodItem.service';
import { CreateMealDishFoodItemDto } from './dto/createMealDishFoodItem.dto';
import { UpdateMealDishFoodItemDto } from './dto/queryMealDishFoodItem.dto';
@Controller('meal-dish-food-item')
export class MealDishFoodItemController {
  constructor(
    private readonly mealDishFoodItemService: MealDishFoodItemService,
  ) {}
}
