import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from './meal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>
  ) { }

  //Get all meals
  async findAll(): Promise<Meal[]> {
    return this.mealRepository.find();
  }

  //Get one meal by its id
  async findOneById(id: number): Promise<Meal | null> {
    return this.mealRepository.findOne({ where: { id } });
  }

  //Filter meals by any attribute
  async filter(filters: Partial<Meal>): Promise<Meal[]> {
    try {
      const queryBuilder = this.mealRepository.createQueryBuilder('meal');

      // Iterate through the filter keys and add them to the query
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          queryBuilder.andWhere(`meal.${key} LIKE :${key}`, { [key]: `%${value}%` });
        }
      }

      // Execute the query
      return await queryBuilder.getMany();
    } catch (error) {
      console.error("Error filtering meals:", error);
      throw new Error("An error occurred while filtering meals. Please try again later.");
    }
  }

  //Create a meal
  async create(mealData: Partial<Meal>): Promise<Meal | null> {
    try {
      const meal = this.mealRepository.create(mealData);
      await this.mealRepository.save(meal);
      return meal;
    } catch (error) {
      console.error("Error creating meal:", error);
      throw new Error("An error occurred while creating the meal. Please try again later.");
    }
  }

  //Update a meal
  async update(id: number, mealData: Partial<Meal>): Promise<Meal | null> {
    try {
      const meal = await this.findOneById(id);

      if (!meal) {
        throw new Error(`Meal with id ${id} not found`);
      }

      await this.mealRepository.update(id, mealData);

      const updatedMeal = await this.findOneById(id);

      if (!updatedMeal) {
        throw new Error(`Could not update meal with id ${id}`);
      }

      return updatedMeal;
    } catch (error) {
      throw new Error(`Error updating meal: ${error}`);
    }
  }

  //Delete a meal
  async delete(id: number): Promise<string> {
    try {
      const result = await this.mealRepository.delete({ id });

      if (result.affected === 0) {
        throw new Error(`Meal with id ${id} not found`);
      }

      return `Meal with id ${id} deleted successfully`;
    } catch (error) {
      throw new Error(`Error deleting meal: ${error}`);
    }
  }
}
