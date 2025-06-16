import { DishFoodItemModule } from './dishFoodItem/dishfooditem.module';
import { DishFoodItemService } from './dishFoodItem/dishfooditem.service';
import { DishFoodItemController } from './dishFoodItem/dishfooditem.controller';
import { FoodItemService } from './foodItem/fooditem.service';
import { FoodItemModule } from './foodItem/fooditem.module';
import { FoodItemController } from './foodItem/fooditem.controller';
import { UserModule } from './user/user.module';
import { AdminModule } from './user/admin.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishModule } from './dish/dish.module';
import { MealModule } from './meal/meal.module';
import { User } from './user/user.entity';
import { BaseUser } from './user/baseUser.entity';
import { Admin } from './user/admin.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { FoodItem } from './foodItem/foodItem.entity';
import { Dish } from './dish/dish.entity';
import { DishFoodItem } from './dishFoodItem/dishFoodItem.entity';
import { Meal } from './meal/meal.entity';
import { DayModule } from './day/day.module';
import { Day } from './day/day.entity';
import { DayMealModule } from './dayMeal/dayMeal.module';
import { DayMeal } from './dayMeal/dayMeal.entity';
import { DayUser } from './dayUser/dayUser.entity';
import { DayUserModule } from './dayUser/dayUser.module';
import { UserMealType } from './userMealType/userMealType.entity';
import { UserMealTypeModule } from './userMealType/userMealType.module';
import { MealDishFoodItemModule } from './mealDishFoodItem/mealDishFoodItem.module';
import { MealDishFoodItem } from './mealDishFoodItem/mealDishFoodItem.entity';
import { PantryModule } from './pantry/pantry.module';
import { Pantry } from './pantry/pantry.entity';
import { ShoppingModule } from './shoppinglist/shoppinglist.module';
import { Shoppinglist } from './shoppinglist/shoppinglist.entity';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';

@Module({
  imports: [
    FoodItemModule,
    UserModule,
    AdminModule,
    DishModule,
    DishFoodItemModule,
    MealModule,
    DayModule,
    DayMealModule,
    DayUserModule,
    UserMealTypeModule,
    MealDishFoodItemModule,
    PantryModule,
    ShoppingModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Admin, BaseUser, User, FoodItem, Dish, DishFoodItem, Meal, Day, DayMeal, DayUser, UserMealType, MealDishFoodItem, Pantry, Shoppinglist],
      synchronize: true,
      logging: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
