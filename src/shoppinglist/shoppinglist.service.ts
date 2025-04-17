import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shoppinglist } from './shoppinglist.entity';
import { User } from 'src/user/user.entity';
import { FoodItem } from 'src/foodItem/foodItem.entity';
import { CreateShoppingDto } from './dto/createShoppingList.dto';
import { QueryShoppingDto } from './dto/queryShoppingList.dto';
import { UserService } from 'src/user/user.service';
import { FoodItemService } from 'src/foodItem/fooditem.service';

@Injectable()
export class ShoppingService {
  constructor(
    @InjectRepository(Shoppinglist)
    private readonly shoppingRepository: Repository<Shoppinglist>,
    private readonly userService: UserService,
    private readonly foodItemService: FoodItemService
  ) { }

  async create(dto: CreateShoppingDto): Promise<Shoppinglist> {
    const user = await this.userService.findOneById(dto.userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    const foodItem = await this.foodItemService.deepFind(dto.foodItemId);
    if (!foodItem) {
      throw new NotFoundException(`FoodItem with ID ${dto.foodItemId} not found`);
    }

    const shopping = this.shoppingRepository.create({
      user,
      foodItem,
      quantity: dto.quantity,
      unit: dto.unit,
    });

    return this.shoppingRepository.save(shopping);
  }

  async findAll(): Promise<Shoppinglist[]> {
    return this.shoppingRepository.find({ relations: ['user', 'foodItem'] });
  }

  async findOne(id: number): Promise<Shoppinglist> {
    const shopping = await this.shoppingRepository.findOne({
      where: { id },
      relations: ['user', 'foodItem'],
    });
    if (!shopping) {
      throw new NotFoundException(`Shopping item with ID ${id} not found`);
    }
    return shopping;
  }

  async update(id: number, dto: QueryShoppingDto): Promise<Shoppinglist> {
    const shopping = await this.findOne(id);

    if (dto.userId) {
      const user = await this.userService.findOneById(dto.userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${dto.userId} not found`);
      }
      shopping.user = user;
    }

    if (dto.foodItemId) {
      const foodItem = await this.foodItemService.deepFind(dto.foodItemId);
      if (!foodItem) {
        throw new NotFoundException(`FoodItem with ID ${dto.foodItemId} not found`);
      }
      shopping.foodItem = foodItem;
    }

    if (dto.quantity !== undefined) {
      shopping.quantity = dto.quantity;
    }

    if (dto.unit !== undefined) {
      shopping.unit = dto.unit;
    }

    return this.shoppingRepository.save(shopping);
  }

  async remove(id: number): Promise<string> {
    const shopping = await this.findOne(id);
    await this.shoppingRepository.remove(shopping);
    return `Shopping item with ID ${id} has been deleted`;
  }
}
