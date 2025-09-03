import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { MealModule } from '../meal/meal.module';
import { UserModule } from '../user/user.module';
import { DayModule } from '../day/day.module';
import { DishModule } from '../dish/dish.module';

@Module({
  imports: [MealModule, UserModule, DayModule, DishModule],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
