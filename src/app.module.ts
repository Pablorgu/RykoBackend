import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as fs from 'node:fs';

import { FoodItemModule } from './foodItem/fooditem.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './user/admin.module';
import { DishModule } from './dish/dish.module';
import { DishFoodItemModule } from './dishFoodItem/dishfooditem.module';
import { MealModule } from './meal/meal.module';
import { DayModule } from './day/day.module';
import { MealDishModule } from './mealDish/mealDish.module';
import { MealDishFoodItemModule } from './mealDishFoodItem/mealDishFoodItem.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { PasswordResetModule } from './auth/password-reset.module';

import { Admin } from './user/admin.entity';
import { BaseUser } from './user/baseUser.entity';
import { User } from './user/user.entity';
import { FoodItem } from './foodItem/foodItem.entity';
import { Dish } from './dish/dish.entity';
import { DishFoodItem } from './dishFoodItem/dishFoodItem.entity';
import { Meal } from './meal/meal.entity';
import { Day } from './day/day.entity';
import { MealDish } from './mealDish/mealDish.entity';
import { MealDishFooditem } from './mealDishFoodItem/mealDishFoodItem.entity';
import { PasswordReset } from './auth/password-reset.entity';

import configuration from './config/configuration';

function loadCA(cs: ConfigService): string | undefined {
  const path = cs.get<string>('DATABASE_SSL_CA') || './certs/aiven-ca.pem';
  if (path && fs.existsSync(path)) return fs.readFileSync(path, 'utf8');
  return undefined;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),

    FoodItemModule,
    UserModule,
    AdminModule,
    DishModule,
    DishFoodItemModule,
    MealModule,
    DayModule,
    MealDishModule,
    MealDishFoodItemModule,
    RecommendationModule,
    AuthModule,
    UploadModule,
    PasswordResetModule,

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => {
        const ca = loadCA(cs);
        return {
          type: 'mysql',
          host: cs.get<string>('DATABASE_HOST'),
          port: Number(cs.get<string>('DATABASE_PORT')),
          username: cs.get<string>('DATABASE_USER'),
          password: cs.get<string>('DATABASE_PASSWORD'),
          database: cs.get<string>('DATABASE_NAME'),
          entities: [
            Admin,
            BaseUser,
            User,
            FoodItem,
            Dish,
            DishFoodItem,
            Meal,
            Day,
            MealDish,
            MealDishFooditem,
            PasswordReset,
          ],
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: false,
          logging: cs.get('DB_LOGGING') === 'true',
          ssl: ca ? { ca, rejectUnauthorized: false } : undefined,
        };
      },
    }),
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}
  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') {
      await this.dataSource.runMigrations();
    }
  }
}
