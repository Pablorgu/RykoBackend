import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { FoodItemService } from './fooditem.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('fooditems')
export class FoodItemController {
  constructor(private readonly foodTemService: FoodItemService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':barcode')
  async findOneByBarcode(@Param('barcode') barcode: number) {
    return this.foodTemService.deepFind(barcode);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async searchByName(@Query('name') name: string) {
    return this.foodTemService.searchProducts(name);
  }
}
