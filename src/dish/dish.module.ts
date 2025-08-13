import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './dish.entity';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';
import { FoodItemModule } from '../foodItem/fooditem.module';
import { DishFoodItem } from '../dishFoodItem/dishFoodItem.entity';
import { FoodItem } from '../foodItem/foodItem.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Dish, DishFoodItem, FoodItem]),
        FoodItemModule
    ],
    controllers: [DishController],
    providers: [DishService],
    exports: [DishService],
})
export class DishModule {}
