
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DishFoodItem } from './dishFoodItem.entity';
import { Repository } from 'typeorm';
import { CreateDishFoodItemDto } from './dto/createDishFoodItem.dto';
import { QueryDishFoodItemDto } from './dto/queryDishFoodItem.dto';
import { DishService } from 'src/dish/dish.service';
import { FoodItemService } from 'src/foodItem/fooditem.service';

@Injectable()
export class DishFoodItemService {
    constructor(
        @InjectRepository(DishFoodItem)
        private readonly dishFoodItemRepository: Repository<DishFoodItem>,
        private readonly dishService: DishService,
        private readonly foodItemService: FoodItemService,
    ) {}

        async create(createDishFoodItemDto: CreateDishFoodItemDto): Promise<DishFoodItem> {
            const { dishId, foodItemId, quantity, unit } = createDishFoodItemDto;
        
            // Searching the entities
            const dish = await this.dishService.findOneById(dishId);
            const foodItem = await this.foodItemService.deepFind(foodItemId);
        
            // Checking that the entities exist
            if (!dish || !foodItem) {
                throw new Error('Dish or FoodItem not found');
            }
        
            // Creating the DishFoodItem entity
            const dishFoodItem = this.dishFoodItemRepository.create({
                dish,
                foodItem,
                quantity,
                unit,
            });
        
            return this.dishFoodItemRepository.save(dishFoodItem);
        }
    
    // Find all FoodItems associated with a specific Dish
    async findByDishId(dishId: number): Promise<DishFoodItem[]> {
        return this.dishFoodItemRepository.find({
            where: { dish: { id: dishId } }, // Access the id inside the related Dish entity
            relations: ['dish', 'foodItem'], // Load related entities if needed
        });
    }

    // Find all Dishes associated with a specific FoodItem
    async findByFoodItemId(foodItemId: number): Promise<DishFoodItem[]> {
        return this.dishFoodItemRepository.find({
            where: { foodItem: { barcode: foodItemId } }, // Access the id inside the related FoodItem entity
            relations: ['dish', 'foodItem'], // Load related entities if needed
        });
    }

    // Update the quantity of a FoodItem in a Dish
    async update(id: number, updateDishFoodItemDto: QueryDishFoodItemDto): Promise<DishFoodItem | null> {
        await this.dishFoodItemRepository.update(id, updateDishFoodItemDto);
        return this.dishFoodItemRepository.findOne({ where: { id } });
    }

    // Remove a FoodItem from a Dish
    async delete(id: number): Promise<{ message: string }> {
        const result = await this.dishFoodItemRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`DishFoodItem with ID ${id} not found`);
        }
        return { message: `DishFoodItem with ID ${id} has been deleted` };
    }
    
}
