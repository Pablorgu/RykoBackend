import { Controller, Post, Body, Get, Param, Put, Delete, Patch } from '@nestjs/common';
import { PantryService } from './pantry.service';
import { CreatePantryDto } from './dto/createPantry.dto';
import { Pantry } from './pantry.entity';
import { QueryPantryDto } from './dto/queryPantry.dto';

@Controller('pantry')
export class PantryController {
  constructor(private readonly pantryService: PantryService) { }

  @Post()
  async create(@Body() createPantryDto: CreatePantryDto): Promise<Pantry> {
    return this.pantryService.create(createPantryDto);
  }

  @Get()
  async findAll(): Promise<Pantry[]> {
    return this.pantryService.findAll();
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: number): Promise<Pantry[]> {
    return this.pantryService.findByUserId(userId);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Pantry | null> {
    return this.pantryService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePantryDto: QueryPantryDto): Promise<Pantry> {
    return this.pantryService.update(id, updatePantryDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<string> {
    return this.pantryService.remove(id);
  }
}
