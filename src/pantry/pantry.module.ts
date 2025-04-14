
import { Module } from '@nestjs/common';
import { PantryController } from './pantry.controller';
import { PantryService } from './pantry.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pantry } from './pantry.entity';
import { UserModule } from 'src/user/user.module';
import { FoodItemModule } from 'src/foodItem/fooditem.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pantry]), UserModule, FoodItemModule],
  controllers: [PantryController],
  providers: [PantryService],
  exports: [PantryService],
})
export class PantryModule { }
