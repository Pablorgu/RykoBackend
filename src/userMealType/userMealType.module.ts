import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { MealModule } from "src/meal/meal.module";
import { UserMealTypeController } from "./userMealType.controller";
import { UserMealTypeService } from "./userMealType.service";
import { UserMealType } from "./userMealType.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserMealType]), UserModule, MealModule],
  controllers: [UserMealTypeController],
  providers: [UserMealTypeService],
  exports: [UserMealTypeService],
})
export class UserMealTypeModule { }
