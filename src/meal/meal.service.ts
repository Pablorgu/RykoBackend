import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from './meal.entity';
import { CreateMealDto } from './dto/createMeal.dto';
import { UpdateMealDto } from './dto/updateMeal.dto';

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
  ) {}

  async findAll(): Promise<Meal[]> {
    return await this.mealRepository.find({
      relations: ['day', 'mealDishes'],
    });
  }

  async findOne(id: number): Promise<Meal> {
    const meal = await this.mealRepository.findOne({
      where: { id },
      relations: ['day', 'mealDishes'],
    });

    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }

    return meal;
  }

  async findByDay(dayId: number): Promise<Meal[]> {
    return await this.mealRepository.find({
      where: { day: { id: dayId } },
      relations: ['day', 'mealDishes'],
    });
  }

  async update(id: number, updateMealDto: UpdateMealDto): Promise<Meal> {
    const meal = await this.findOne(id);
    Object.assign(meal, updateMealDto);
    return await this.mealRepository.save(meal);
  }

  async remove(id: number): Promise<void> {
    const meal = await this.findOne(id);
    await this.mealRepository.remove(meal);
  }
}
