import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { Dish } from './dish.entity';
import { CreateDishDto } from './dto/createDish.dto';
import { QueryDishDto } from './dto/queryDish.dto';
import { filter } from 'rxjs';
import { CreateDishWithIngredientsDto } from './dto/createDishWithIngredients.dto';
import { UpdateDishIngredientsDto } from './dto/updateDishIngredients.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @UseGuards(JwtAuthGuard)
  @Get('filter')
  async filterDishes(@Query() filters: Partial<Dish>): Promise<Dish[]> {
    return this.dishService.filterDishes(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: number): Promise<Dish[]> {
    return this.dishService.findAllByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId/plates')
  async getUserPlatesFormatted(@Param('userId') userId: number): Promise<
    Array<{
      id: string;
      name: string;
      description?: string;
      image?: string;
      ingredients: string[];
      macros: { carbs: number; fat: number; protein: number };
    }>
  > {
    return this.dishService.findUserPlatesFormatted(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<Dish | null> {
    const dishId = parseInt(id, 10);
    return this.dishService.findOneById(dishId);
  }

  // Get dish with ingredients in home screen format
  @UseGuards(JwtAuthGuard)
  @Get(':id/detailed')
  async getDishWithIngredients(@Param('id') id: string): Promise<{
    id: string;
    name: string;
    ingredients: Array<{
      id: string;
      name: string;
      baseQuantity: number;
      nutrientsPer100g: {
        kcal: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
        satFat: number;
      };
    }>;
    imageUrl?: string;
  }> {
    const dishId = parseInt(id, 10);
    return this.dishService.getDishWithIngredients(dishId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createDish(@Body() createDishDto: CreateDishDto) {
    return this.dishService.create(createDishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createDishWithIngredients(
    @Body() createDishWithIngredientsDto: CreateDishWithIngredientsDto,
  ) {
    return this.dishService.createWithIngredients(createDishWithIngredientsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateDish(
    @Param('id') id: number,
    @Body() updateDishDto: QueryDishDto,
  ) {
    return this.dishService.update(id, updateDishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/ingredients')
  async updateIngredients(
    @Param('id') id: string,
    @Body() updateDishIngredientsDto: UpdateDishIngredientsDto,
  ) {
    const dishId = parseInt(id, 10);
    return this.dishService.updateIngredients(dishId, updateDishIngredientsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteDish(@Param('id') id: number) {
    return this.dishService.delete(id);
  }
}
