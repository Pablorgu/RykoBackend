import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealDish } from './mealDish.entity';
import { MealDishService } from './mealDish.service';
import { MealDishController } from './mealDish.controller';
@Module({
  imports: [TypeOrmModule.forFeature([MealDish])],
  providers: [MealDishService],
  controllers: [MealDishController],
  exports: [MealDishService],
})
export class MealDishModule {}
