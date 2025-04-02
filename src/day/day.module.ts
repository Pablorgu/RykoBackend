import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Day } from './day.entity';
import { DayController } from './day.controller';
import { DayService } from './day.service';


@Module({
  imports: [TypeOrmModule.forFeature([Day])],
  controllers: [DayController],
  providers: [DayService],
  exports: [DayService],
})
export class DayModule { }
