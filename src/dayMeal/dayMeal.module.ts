import { TypeOrmModule } from "@nestjs/typeorm";
import { DayMeal } from "./dayMeal.entity";
import { DayMealController } from "./dayMeal.controller";
import { DayMealService } from "./dayMeal.service";
import { Module } from "@nestjs/common";
import { MealModule } from "src/meal/meal.module";
import { DayModule } from "src/day/day.module";

@Module({
  imports: [TypeOrmModule.forFeature([DayMeal]), DayModule, MealModule],
  controllers: [DayMealController],
  providers: [DayMealService],
  exports: [DayMealService],
})
export class DayMealModule { }
