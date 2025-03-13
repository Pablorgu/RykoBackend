import { FoodItem } from './foodItem.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodItemController } from './fooditem.controller';
import { FoodItemService } from './fooditem.service';

@Module({
    imports: [TypeOrmModule.forFeature([FoodItem])],
    controllers: [FoodItemController],
    providers: [FoodItemService],
    exports: [FoodItemService]
})
export class FoodItemModule {}
