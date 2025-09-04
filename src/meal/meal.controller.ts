import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { Meal } from './meal.entity';
import { UpdateMealDto } from './dto/updateMeal.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('meals')
export class MealController {
  constructor(private readonly mealService: MealService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Meal[]> {
    return await this.mealService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Meal> {
    return await this.mealService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('day/:dayId')
  async findByDay(
    @Param('dayId', ParseIntPipe) dayId: number,
  ): Promise<Meal[]> {
    return await this.mealService.findByDay(dayId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMealDto: UpdateMealDto,
  ): Promise<Meal> {
    return await this.mealService.update(id, updateMealDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.mealService.remove(id);
  }
}
