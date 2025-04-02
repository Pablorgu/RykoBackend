import { DayService } from "./day.service";
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Day } from "./day.entity";

@Controller('day')
export class DayController {
  constructor(private readonly dayService: DayService) { }

  @Get()
  async findAll(): Promise<Day[]> {
    return this.dayService.findAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<Day> {
    return this.dayService.findOneById(id);
  }

  @Post()
  async create(@Body() dayData: Partial<Day>): Promise<Day> {
    return this.dayService.create(dayData);
  }

  @Put(':id')
  async update(@Param(':id') id: number, @Body() dayData: Partial<Day>): Promise<Day> {
    return this.dayService.update(id, dayData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<string> {
    return this.dayService.remove(id);
  }
} 
