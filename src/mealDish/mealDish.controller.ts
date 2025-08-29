import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MealDishService } from './mealDish.service';
import { CreateMealDishDto } from './dto/createMealDish.dto';
import { UpdateMealDishDto } from './dto/updateMealDish.dto';
@Controller('meal-dishes')
export class MealDishController {
  constructor(private readonly mealDishService: MealDishService) {}
}
