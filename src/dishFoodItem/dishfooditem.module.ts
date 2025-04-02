import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishFoodItem } from './dishFoodItem.entity';
import { DishFoodItemController } from './dishfooditem.controller';
import { DishFoodItemService } from './dishfooditem.service';
import { DishModule } from 'src/dish/dish.module';
import { FoodItemModule } from 'src/foodItem/fooditem.module';

@Module({
  imports: [TypeOrmModule.forFeature([DishFoodItem]), DishModule, FoodItemModule],
  controllers: [DishFoodItemController],
  providers: [DishFoodItemService],
  exports: [DishFoodItemService]
})
export class DishFoodItemModule { }
