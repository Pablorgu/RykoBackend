import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MealService } from './meal.service';
import { Meal } from './meal.entity';
import { CreateMealDto } from './dto/createmeal.dto';
import { QueryMealDto } from './dto/querymeal.dto';
@Controller('meals')
export class MealController {
  constructor(private readonly mealService: MealService) { }


  @Get('filter')
  async filterMeals(@Query() filters: Partial<Meal>): Promise<Meal[]> {
    return this.mealService.filter(filters);
  }

  @Get(':id')
  async findOneById(@Param('id') mealid: number): Promise<Meal | null> {
    return this.mealService.findOneById(mealid);
  }

  @Post()
  async createMeal(@Body() createMealDto: CreateMealDto): Promise<Meal | null> {
    return this.mealService.create(createMealDto);
  }

  @Put(':id')
  async updateMeal(@Param('id') id: number, @Body() queryMealDto: QueryMealDto): Promise<Meal | null> {
    return this.mealService.update(id, queryMealDto);
  }

  @Delete(':id')
  async deleteMeal(@Param('id') id: number): Promise<string> {
    return this.mealService.delete(id);
  }
}
