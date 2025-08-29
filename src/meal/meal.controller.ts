import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/createMeal.dto';
import { Meal } from './meal.entity';
import { UpdateMealDto } from './dto/updateMeal.dto';

@Controller('meals')
export class MealController {
  constructor(private readonly mealService: MealService) {}
  @Get()
  async findAll(): Promise<Meal[]> {
    return await this.mealService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Meal> {
    return await this.mealService.findOne(id);
  }

  @Get('day/:dayId')
  async findByDay(
    @Param('dayId', ParseIntPipe) dayId: number,
  ): Promise<Meal[]> {
    return await this.mealService.findByDay(dayId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMealDto: UpdateMealDto,
  ): Promise<Meal> {
    return await this.mealService.update(id, updateMealDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.mealService.remove(id);
  }
}
