import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { Meal } from '../meal/meal.entity';
import { Dish } from '../dish/dish.entity';
import { DishFoodItem } from '../dishFoodItem/dishFoodItem.entity';
import { Day } from '../day/day.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meal, Dish, DishFoodItem, Day, User])],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
