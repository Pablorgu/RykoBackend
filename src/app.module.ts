import { UserModule } from './user/user.module';
import { AdminModule } from './user/admin.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DishModule } from './dish/dish.module';
import { MealModule } from './meal/meal.module';
import { User } from './user/user.entity';
import { BaseUser } from './user/baseUser.entity';
import { Admin } from './user/admin.entity';

@Module({
  imports: [
    UserModule,
    AdminModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Admin, BaseUser, User],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
