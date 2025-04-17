import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ShoppingService } from './shoppinglist.service';
import { CreateShoppingDto } from './dto/createShoppingList.dto';
import { QueryShoppingDto } from './dto/queryShoppingList.dto';

@Controller('shoppinglist')
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) { }

  @Post()
  async create(@Body() createShoppingDto: CreateShoppingDto) {
    return this.shoppingService.create(createShoppingDto);
  }

  @Get()
  async findAll() {
    return this.shoppingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shoppingService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShoppingDto: QueryShoppingDto,
  ) {
    return this.shoppingService.update(id, updateShoppingDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.shoppingService.remove(id);
  }
}
