import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pantry } from './pantry.entity';
import { CreatePantryDto } from './dto/createPantry.dto';
import { UserService } from 'src/user/user.service';
import { FoodItemService } from 'src/foodItem/fooditem.service';
import { QueryPantryDto } from './dto/queryPantry.dto';

@Injectable()
export class PantryService {
  constructor(
    @InjectRepository(Pantry)
    private readonly pantryRepository: Repository<Pantry>,
    private readonly userService: UserService,
    private readonly foodItemService: FoodItemService,
  ) { }

  async create(dto: CreatePantryDto): Promise<Pantry> {
    try {
      const user = await this.userService.findOneById(dto.userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${dto.userId} not found`);
      }

      const foodItem = await this.foodItemService.findOneByBarcode(dto.foodItemId);
      if (!foodItem) {
        throw new NotFoundException(`FoodItem with ID ${dto.foodItemId} not found`);
      }

      const pantryItem = this.pantryRepository.create({
        ...dto,
        user,
        foodItem,
      });

      return await this.pantryRepository.save(pantryItem);

    } catch (error) {
      throw new BadRequestException('Invalid data provided');
    }
  }

  async findAll(): Promise<Pantry[]> {
    return this.pantryRepository.find({
      relations: ['user', 'foodItem'],
    });
  }

  async findByUserId(userId: number): Promise<Pantry[]> {
    return this.pantryRepository.find({
      where: { user: { id: userId } },
      relations: ['foodItem'],
    });
  }

  async findById(id: number): Promise<Pantry> {
    const pantryItem = await this.pantryRepository.findOne({
      where: { id },
      relations: ['user', 'foodItem'],
    });

    if (!pantryItem) {
      throw new NotFoundException(`Pantry item with ID ${id} not found`);
    }

    return pantryItem;
  }

  async update(id: number, dto: Partial<Pantry>): Promise<Pantry> {
    try {
      const pantryItem = await this.findById(id);

      if (!pantryItem) {
        throw new NotFoundException(`Pantry item with ID ${id} not found`);
      }

      if (dto.user !== undefined) {
        const user = await this.userService.findOneById(dto.user.id);
        if (user) {
          pantryItem.user = user;
        }
      }

      if (dto.foodItem !== undefined) {
        const foodItem = await this.foodItemService.findOneByBarcode(dto.foodItem.barcode);
        if (foodItem) {
          pantryItem.foodItem = foodItem;
        }
      }

      if (dto.quantity !== undefined) {
        pantryItem.quantity = dto.quantity;
      }

      if (dto.quantityToBuy !== undefined) {
        pantryItem.quantityToBuy = dto.quantityToBuy;
      }

      if (dto.unit !== undefined && dto.unit !== null) {
        pantryItem.unit = dto.unit;
      }

      return await this.pantryRepository.save(pantryItem);
    } catch (error) {
      throw new BadRequestException('Failed to update Pantry item');
    }
  }

  async remove(id: number): Promise<string> {
    const result = await this.pantryRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Pantry item with ID ${id} not found`);
    }

    return 'Pantry item deleted successfully';
  }
}
