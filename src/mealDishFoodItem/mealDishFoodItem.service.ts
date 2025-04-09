import { Injectable, NotFoundException, BadRequestException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealDishFoodItem } from './mealDishFoodItem.entity';
import { CreateMealDishFoodItemDto } from './dto/createMealDishFoodItem.dto';
import { UpdateMealDishFoodItemDto } from './dto/queryMealDishFoodItem.dto';
import { MealService } from 'src/meal/meal.service';
import { DishService } from 'src/dish/dish.service';
import { FoodItemService } from 'src/foodItem/fooditem.service';

@Injectable()
export class MealDishFoodItemService {
  constructor(
    @InjectRepository(MealDishFoodItem)
    private readonly repository: Repository<MealDishFoodItem>,
    private readonly mealService: MealService,
    private readonly dishService: DishService,
    private readonly foodItemService: FoodItemService,
  ) { }


  async create(dto: CreateMealDishFoodItemDto): Promise<MealDishFoodItem> {
    try {
      const meal = await this.mealService.findOneById(dto.mealId);
      const dish = await this.dishService.findOneById(dto.dishId);
      const foodItem = await this.foodItemService.findOneByBarcode(dto.foodItemId);

      if (!meal || !dish || !foodItem) {
        throw new BadRequestException('Meal, Dish, or FoodItem not found');
      }

      const entity = this.repository.create({
        ...dto,
        meal,
        dish,
        foodItem,
      });

      return await this.repository.save(entity);
    } catch (error) {
      throw new BadRequestException('Failed to create MealDishFoodItem');
    }
  }


  async findAll(): Promise<MealDishFoodItem[]> {
    return this.repository.find({
      relations: ['meal', 'dish', 'foodItem'],
    });
  }

  async findOne(id: number): Promise<MealDishFoodItem> {
    const item = await this.repository.findOne({
      where: { id },
      relations: ['meal', 'dish', 'foodItem'],
    });

    if (!item) {
      throw new NotFoundException(`MealDishFoodItem with id ${id} not found`);
    }

    return item;
  }

  async findByMealId(mealId: number): Promise<MealDishFoodItem[]> {
    return this.repository.find({
      where: { meal: { id: mealId } },
      relations: ['meal', 'dish', 'foodItem'],
    });
  }

  async findByDishId(dishId: number): Promise<MealDishFoodItem[]> {
    return this.repository.find({
      where: { dish: { id: dishId } },
      relations: ['meal', 'dish', 'foodItem'],
    });
  }

  async findByFoodItemId(foodItemId: number): Promise<MealDishFoodItem[]> {
    return this.repository.find({
      where: { foodItem: { barcode: foodItemId } },
      relations: ['meal', 'dish', 'foodItem'],
    });
  }

  async update(id: number, dto: UpdateMealDishFoodItemDto): Promise<MealDishFoodItem> {
    try {
      const item = await this.findOne(id);

      const meal = dto.mealId ? await this.mealService.findOneById(dto.mealId) : item.meal;
      const dish = dto.dishId ? await this.dishService.findOneById(dto.dishId) : item.dish;
      const foodItem = dto.foodItemId ? await this.foodItemService.findOneByBarcode(dto.foodItemId) : item.foodItem;

      if (dto.mealId && !meal) {
        throw new BadRequestException(`Meal with ID ${dto.mealId} not found`);
      }
      if (dto.dishId && !dish) {
        throw new BadRequestException(`Dish with ID ${dto.dishId} not found`);
      }
      if (dto.foodItemId && !foodItem) {
        throw new BadRequestException(`FoodItem with ID ${dto.foodItemId} not found`);
      }

      const updatedItem = this.repository.merge(item, {
        ...dto,
        meal: meal ?? item.meal, // Si no hay mealId, usa el valor anterior
        dish: dish ?? item.dish, // Si no hay dishId, usa el valor anterior
        foodItem: foodItem ?? item.foodItem, // Si no hay foodItemId, usa el valor anterior
      });


      return await this.repository.save(updatedItem);
    } catch (error) {
      throw new BadRequestException('Failed to update MealDishFoodItem');
    }
  }

  async remove(id: number): Promise<string> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`MealDishFoodItem with id ${id} not found`);
    }
    return 'Deleted successfully';
  }
}
