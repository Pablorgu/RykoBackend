import { Controller, Get, Param } from '@nestjs/common';
import { FoodItemService } from './fooditem.service';

@Controller('fooditems')
export class FoodItemController {
    constructor(private readonly foodTemService: FoodItemService) {}

    @Get(':barcode')
    async findOneByBarcode(@Param('barcode') barcode: number) {
        return this.foodTemService.deepFind(barcode);
    }

    @Get()
    async searchByName(@Param('name') name: string) {
        return this.foodTemService.searchProducts(name);
    }

}
