
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from './dish.entity';

@Injectable()
export class DishService {
    constructor(
        @InjectRepository(Dish)
        private readonly dishRepository: Repository<Dish>
    ) { }

    //Get all dishes from one user
    async findAllByUser(userId: number): Promise<Dish[]> {
        return this.dishRepository.find({ where: { UserId: userId } });
    }

    //Get one dish by its id
    async findOneById(id: number): Promise<Dish | null> {
        return this.dishRepository.findOne({ where: { id } });
    }

    //Filter dishes by any attribute
    async filterDishes(filters: Partial<Dish>): Promise<Dish[]> {
        try {
            const queryBuilder = this.dishRepository.createQueryBuilder('dish');
    
            // Iterate through the filter keys and add them to the query
            for (const [key, value] of Object.entries(filters)) {
                if (value) {
                    queryBuilder.andWhere(`dish.${key} LIKE :${key}`, { [key]: `%${value}%` });
                }
            }
    
            // Execute the query
            return await queryBuilder.getMany();
        } catch (error) {
            console.error("Error filtering dishes:", error);
            throw new Error("An error occurred while filtering dishes. Please try again later.");
        }
    }
    
    //Create a dish
    async create(dishData: Partial<Dish>): Promise<Dish | null> {
        try {
            const existingDish = await this.dishRepository.findOne({ where: { name: dishData.name, UserId: dishData.UserId} });
    
            if (existingDish) {
                throw new ConflictException(`Dish with name "${dishData.name}" already exists`);
            }
    
            const dish = this.dishRepository.create(dishData);
            await this.dishRepository.save(dish);
            
            return dish;
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;  // Lanzamos el error si es un conflicto con el nombre
            }
    
            throw new InternalServerErrorException("An error occurred while creating the dish");
        }
    }

    //Update a dish
    async update(id: number, dishData: Partial<Dish>): Promise<Dish> {
        try {
            const dish = await this.findOneById(id);
    
            if (!dish) {
                throw new NotFoundException(`Dish with ID ${id} not found`);
            }
    
            await this.dishRepository.update({ id }, dishData);
    
            const updatedDish = await this.dishRepository.findOne({ where: { id } });
    
            if (!updatedDish) {
                throw new InternalServerErrorException("Failed to update the dish");
            }
    
            return updatedDish;
        } catch (error) {
            throw new InternalServerErrorException("An error occurred while updating the dish");
        }
    }

    //Delete a dish
    async delete(id: number): Promise<string> {
        try {
            const result = await this.dishRepository.delete({ id });
    
            if (result.affected === 0) {
                throw new NotFoundException(`Dish with ID ${id} not found`);
            }
    
            return "Dish deleted successfully";
        } catch (error) {
            throw new InternalServerErrorException("An error occurred while deleting the dish");
        }
    }
}
