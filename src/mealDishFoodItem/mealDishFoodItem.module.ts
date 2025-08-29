import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealDishFooditem } from './mealDishFoodItem.entity';
import { MealDishFoodItemService } from './mealDishFoodItem.service';
import { MealDishFoodItemController } from './mealDishFoodItem.controller';
import { DishModule } from 'src/dish/dish.module';
import { FoodItemModule } from 'src/foodItem/fooditem.module';
import { MealModule } from 'src/meal/meal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MealDishFooditem]),
    DishModule,
    FoodItemModule,
    MealModule,
  ],
  providers: [MealDishFoodItemService],
  controllers: [MealDishFoodItemController],
  exports: [MealDishFoodItemService],
})
export class MealDishFoodItemModule {}
