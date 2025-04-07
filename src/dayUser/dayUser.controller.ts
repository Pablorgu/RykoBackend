import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CreateDayUserDto } from "./dto/createDayUser.dto";
import { DayUserService } from "./dayUser.service";
import { DayUser } from "./dayUser.entity";

@Controller()
export class DayUserController {
  constructor(private readonly dayUserService: DayUserService) { }

  @Post('day-user')
  async create(@Body() createDayUserDto: CreateDayUserDto): Promise<DayUser> {
    return this.dayUserService.create(createDayUserDto);
  }

  @Get('day/:dayId/users')
  async findByDayId(@Param('dayId') dayId: number): Promise<DayUser[]> {
    return this.dayUserService.findByDayId(dayId);
  }

  @Get('user/:userId/days')
  async findByUserId(@Param('userId') userId: number): Promise<DayUser[]> {
    return this.dayUserService.findByUserId(userId);
  }

  @Delete('day-user/:id')
  async delete(@Param('id') id: number): Promise<string> {
    return this.dayUserService.remove(id);
  }
}
