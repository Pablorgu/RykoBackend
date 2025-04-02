import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { DayMealService } from "./dayMeal.service";
import { CreateDayMealDto } from "./dto/createDayMeal.dto";
import { DayMeal } from "./dayMeal.entity";

@Controller()
export class DayMealController {
  constructor(private readonly dayMealService: DayMealService) { }

  @Post('day-meal')
  async create(@Body() createDayMealDto: CreateDayMealDto): Promise<DayMeal> {
    return this.dayMealService.create(createDayMealDto);
  }

  @Get('day/:dayId/meals')
  async findByDayId(@Param('dayId') dayId: number): Promise<DayMeal[]> {
    console.log(dayId);
    return this.dayMealService.findByDayId(dayId);
  }

  @Get('meal/:mealId/days')
  async findByMealId(@Param('mealId') mealId: number): Promise<DayMeal[]> {
    console.log(mealId);
    return this.dayMealService.findByMealId(mealId);
  }

  @Patch('day-meal/:id')
  async update(
    @Param('id') id: number,
    @Body() updateDayMealDto: Partial<DayMeal>
  ): Promise<DayMeal | null> {
    return this.dayMealService.update(id, updateDayMealDto);
  }

  @Delete('day-meal/:id')
  async delete(@Param('id') id: number): Promise<string> {
    return this.dayMealService.remove(id);
  }
}
