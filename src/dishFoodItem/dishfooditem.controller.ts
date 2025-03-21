
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DishFoodItemService } from './dishfooditem.service';
import { CreateDishFoodItemDto } from './dto/createDishFoodItem.dto';
import { DishFoodItem } from './dishFoodItem.entity';
import { QueryDishFoodItemDto } from './dto/queryDishFoodItem.dto';

@Controller()
export class DishFoodItemController {
    constructor(private readonly dishFoodItemService: DishFoodItemService) {}

    @Post('dish-food-item')
    async create(@Body() createDishFoodItemDto: CreateDishFoodItemDto): Promise<DishFoodItem> {
      return this.dishFoodItemService.create(createDishFoodItemDto);
    }

    // Find all FoodItems associated with a specific Dish
    @Get('dish/:dishId/food-items')
    async findByDishId(@Param('dishId') dishId: number): Promise<DishFoodItem[]> {
        return this.dishFoodItemService.findByDishId(dishId);
    }

    // Find all Dishes associated with a specific FoodItem
    @Get('food-item/:foodItemId/dishes')
    async findByFoodItemId(@Param('foodItemId') foodItemId: number): Promise<DishFoodItem[]> {
        return this.dishFoodItemService.findByFoodItemId(foodItemId);
    }

    // Update a Dish-FoodItem relationship (e.g., quantity)
    @Patch('dish-food-item/:id')
    async update(
        @Param('id') id: number,
        @Body() updateDishFoodItemDto: QueryDishFoodItemDto
    ): Promise<DishFoodItem | null> {
        return this.dishFoodItemService.update(id, updateDishFoodItemDto);
    }

    // Delete a Dish-FoodItem relationship
    @Delete('dish-food-item/:id')
    async delete(@Param('id') id: number): Promise<{ message: string }> {
        return this.dishFoodItemService.delete(id);
    }
}
