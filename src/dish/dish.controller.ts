import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DishService } from './dish.service';
import { Dish } from './dish.entity';
import { CreateDishDto } from './dto/createDish.dto';
import { QueryDishDto } from './dto/QueryDish.dto';

@Controller('dishes')
export class DishController {
    constructor(private readonly dishService: DishService) { }

    @Get(':id')
    async findOneById(@Param('id') id: number): Promise<Dish | null> {
        return this.dishService.findOneById(id);
    }

    @Get('user/:userId')
    async findAllByUser(@Param('userId') userId: number): Promise<Dish[]> {
        return this.dishService.findAllByUser(userId);
    }

    @Post()
    async createDish(@Body() createDishDto: CreateDishDto) {
        return this.dishService.create(createDishDto);
    }

    @Put(':id')
    async updateDish(@Param('id') id: number, @Body() updateDishDto: QueryDishDto) {
        return this.dishService.update(id, updateDishDto);
    }

    @Delete(':id')
    async deleteDish(@Param('id') id: number) {
        return this.dishService.delete(id);
    }


}
