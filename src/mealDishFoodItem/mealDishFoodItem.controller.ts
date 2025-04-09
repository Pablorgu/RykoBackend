import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MealDishFoodItemService } from './mealDishFoodItem.service';
import { CreateMealDishFoodItemDto } from './dto/createMealDishFoodItem.dto';
import { UpdateMealDishFoodItemDto } from './dto/queryMealDishFoodItem.dto';
import { MealDishFoodItem } from './mealDishFoodItem.entity';

@Controller('meal-dish-food-item')
export class MealDishFoodItemController {
  constructor(private readonly mealDishFoodItemService: MealDishFoodItemService) { }

  @Post()
  async create(
    @Body() createMealDishFoodItemDto: CreateMealDishFoodItemDto,
  ): Promise<MealDishFoodItem> {
    return this.mealDishFoodItemService.create(createMealDishFoodItemDto);
  }

  @Get()
  async findAll(): Promise<MealDishFoodItem[]> {
    return this.mealDishFoodItemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<MealDishFoodItem> {
    return this.mealDishFoodItemService.findOne(id);
  }

  @Get('meal/:mealId')
  async findByMealId(@Param('mealId') mealId: number): Promise<MealDishFoodItem[]> {
    return this.mealDishFoodItemService.findByMealId(mealId);
  }

  @Get('dish/:dishId')
  async findByDishId(@Param('dishId') dishId: number): Promise<MealDishFoodItem[]> {
    return this.mealDishFoodItemService.findByDishId(dishId);
  }

  @Get('food-item/:foodItemId')
  async findByFoodItemId(@Param('foodItemId') foodItemId: number): Promise<MealDishFoodItem[]> {
    return this.mealDishFoodItemService.findByFoodItemId(foodItemId);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMealDishFoodItemDto: UpdateMealDishFoodItemDto,
  ): Promise<MealDishFoodItem> {
    return this.mealDishFoodItemService.update(id, updateMealDishFoodItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<string> {
    return this.mealDishFoodItemService.remove(id);
  }
}
