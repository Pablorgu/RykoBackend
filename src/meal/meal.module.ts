import { Module } from '@nestjs/common';
import { Type } from 'class-transformer';
import { MealService } from './meal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './meal.entity';
import { MealController } from './meal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Meal])],
  controllers: [MealController],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule { }
