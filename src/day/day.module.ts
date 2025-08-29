import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Day } from './day.entity';
import { Meal } from '../meal/meal.entity';
import { MealDish } from '../mealDish/mealDish.entity';
import { MealDishFooditem } from '../mealDishFoodItem/mealDishFoodItem.entity';
import { Dish } from '../dish/dish.entity';
import { DayController } from './day.controller';
import { DayService } from './day.service';
import { DishModule } from '../dish/dish.module';
import { DishFoodItemModule } from '../dishFoodItem/dishfooditem.module';
import { FoodItemModule } from '../foodItem/fooditem.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Day, Meal, MealDish, MealDishFooditem, Dish]),
    DishModule,
    DishFoodItemModule,
    FoodItemModule
  ],
  controllers: [DayController],
  providers: [DayService],
  exports: [DayService],
})
export class DayModule {}
