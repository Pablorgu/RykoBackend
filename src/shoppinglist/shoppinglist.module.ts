import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shoppinglist } from './shoppinglist.entity';
import { User } from 'src/user/user.entity';
import { FoodItem } from 'src/foodItem/foodItem.entity';
import { ShoppingService } from './shoppinglist.service';
import { ShoppingController } from './shoppinglist.controller';
import { UserModule } from 'src/user/user.module';
import { FoodItemModule } from 'src/foodItem/fooditem.module';

@Module({
  imports: [TypeOrmModule.forFeature([Shoppinglist]), UserModule, FoodItemModule],
  controllers: [ShoppingController],
  providers: [ShoppingService],
  exports: [ShoppingService],
})
export class ShoppingModule { }
