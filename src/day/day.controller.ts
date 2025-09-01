import { DayService } from './day.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Day } from './day.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MealTime } from 'src/meal/enums/mealTime.enum';
import {
  MealItemDto,
  MealDishIngredientOverrideDto,
  DayDto,
} from './dto/day.dto';
import { Request } from 'express';
import { IsNumber, Min } from 'class-validator';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
}

class AddDishToMealDto {
  @IsNumber()
  @Min(0)
  dishId: number;
}

class UpdateIngredientDto {
  @IsNumber()
  @Min(0)
  grams: number;
}

@Controller('day')
export class DayController {
  constructor(private readonly dayService: DayService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Day[]> {
    return this.dayService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':date')
  async getDay(@Param('date') date: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.dayService.getDayDTO(userId, date);
  }

  @UseGuards(JwtAuthGuard)
  @Get('id/:id')
  async findOneById(@Param('id') id: number): Promise<Day> {
    return this.dayService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dayData: Partial<Day>): Promise<Day> {
    return this.dayService.create(dayData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dayData: Partial<Day>,
  ): Promise<Day> {
    return this.dayService.update(id, dayData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<string> {
    return this.dayService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':date/meals/:type/dishes')
  async addDishToMeal(
    @Param('date') date: string,
    @Param('type') type: MealTime,
    @Body() addDishDto: AddDishToMealDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<MealItemDto> {
    const userId = req.user.id;
    return this.dayService.addDish(userId, date, type, addDishDto.dishId);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':date/meals/:type/dishes/:mealDishId/ingredients/:ingredientId')
  async updateIngredient(
    @Param('date') date: string,
    @Param('type') type: MealTime,
    @Param('mealDishId') mealDishId: number,
    @Param('ingredientId') ingredientId: number,
    @Body() updateIngredientDto: UpdateIngredientDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<MealDishIngredientOverrideDto> {
    const userId = req.user.id;
    return this.dayService.updateIngredient(
      userId,
      date,
      type,
      mealDishId,
      ingredientId,
      updateIngredientDto.grams,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':date/meals/:type/dishes/:mealDishId')
  async removeDish(
    @Param('date') date: string,
    @Param('type') type: MealTime,
    @Param('mealDishId') mealDishId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<DayDto> {
    const userId = req.user.id;
    return this.dayService.removeDish(userId, date, type, mealDishId);
  }
}
