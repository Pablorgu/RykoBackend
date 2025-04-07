import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { DayUser } from "./dayUser.entity";
import { DayModule } from "src/day/day.module";
import { Module } from "@nestjs/common";
import { DayUserController } from "./dayUser.controller";
import { DayUserService } from "./dayUser.service";

@Module({
  imports: [TypeOrmModule.forFeature([DayUser]), DayModule, UserModule],
  controllers: [DayUserController],
  providers: [DayUserService],
  exports: [DayUserService],
})
export class DayUserModule { }
