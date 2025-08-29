import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { Meal } from './meal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meal])],
  controllers: [MealController],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule {}