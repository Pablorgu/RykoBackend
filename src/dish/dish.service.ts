import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Dish } from './dish.entity';
import { DishFoodItem } from '../dishFoodItem/dishFoodItem.entity';
import { FoodItem } from '../foodItem/foodItem.entity';
import { FoodItemService } from '../foodItem/fooditem.service';
import { CreateDishWithIngredientsDto } from './dto/createDishWithIngredients.dto';
import { UpdateDishIngredientsDto } from './dto/updateDishIngredients.dto';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
    @InjectRepository(DishFoodItem)
    private readonly dishFoodItemRepository: Repository<DishFoodItem>,
    @InjectRepository(FoodItem)
    private readonly foodItemRepository: Repository<FoodItem>,
    private readonly foodItemService: FoodItemService,
    private dataSource: DataSource,
  ) {}

  //Get all dishes from one user
  async findAllByUser(userId: number): Promise<Dish[]> {
    return this.dishRepository.find({ where: { UserId: userId } });
  }

  //Get one dish by its id
  async findOneById(id: number): Promise<Dish | null> {
    return this.dishRepository.findOne({ where: { id } });
  }

  // Obtain the dish with ingredients in home format
  async getDishWithIngredients(id: number): Promise<{
    id: string;
    name: string;
    ingredients: Array<{
      id: string;
      name: string;
      baseQuantity: number;
      nutrientsPer100g: {
        kcal: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
        satFat: number;
      };
    }>;
    imageUrl?: string;
  }> {
    const dish = await this.dishRepository.findOne({
      where: { id },
      relations: ['dishFoodItems', 'dishFoodItems.foodItem'],
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    const ingredients = (dish.dishFoodItems || []).map((dfi: DishFoodItem) => ({
      id: dfi.foodItem.barcode.toString(),
      name: dfi.foodItem.name,
      baseQuantity: dfi.quantity,
      nutrientsPer100g: {
        kcal: dfi.foodItem.energyKcal || 0,
        protein: dfi.foodItem.proteins || 0,
        carbs: dfi.foodItem.carbohydrates || 0,
        fat: dfi.foodItem.fat || 0,
        fiber: dfi.foodItem.fiber || 0,
        satFat: dfi.foodItem.saturatedFat || 0,
      },
    }));

    return {
      id: dish.id.toString(),
      name: dish.name,
      ingredients,
      imageUrl: dish.image,
    };
  }

  //Filter dishes by any attribute
  async filterDishes(filters: Partial<Dish>): Promise<Dish[]> {
    try {
      const queryBuilder = this.dishRepository.createQueryBuilder('dish');

      // Iterate through the filter keys and add them to the query
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          queryBuilder.andWhere(`dish.${key} LIKE :${key}`, {
            [key]: `%${value}%`,
          });
        }
      }

      // Execute the query
      return await queryBuilder.getMany();
    } catch (error) {
      console.error('Error filtering dishes:', error);
      throw new Error(
        'An error occurred while filtering dishes. Please try again later.',
      );
    }
  }

  //Create a dish
  async create(dishData: Partial<Dish>): Promise<Dish | null> {
    try {
      const existingDish = await this.dishRepository.findOne({
        where: { name: dishData.name, UserId: dishData.UserId },
      });

      if (existingDish) {
        throw new ConflictException(
          `Dish with name "${dishData.name}" already exists`,
        );
      }

      const dish = this.dishRepository.create(dishData);
      await this.dishRepository.save(dish);

      return dish;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while creating the dish',
      );
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
        throw new InternalServerErrorException('Failed to update the dish');
      }

      return updatedDish;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while updating the dish',
      );
    }
  }

  //Delete a dish
  async delete(id: number): Promise<string> {
    try {
      const result = await this.dishRepository.delete({ id });

      if (result.affected === 0) {
        throw new NotFoundException(`Dish with ID ${id} not found`);
      }

      return 'Dish deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while deleting the dish',
      );
    }
  }

  // Create plate with ingredients
  async createWithIngredients(
    dishData: CreateDishWithIngredientsDto,
  ): Promise<Dish | undefined> {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Verificar si ya existe un plato con el mismo nombre para el usuario
        const existingDish = await queryRunner.manager.findOne(Dish, {
          where: { name: dishData.name, UserId: dishData.UserId },
        });

        if (existingDish) {
          throw new ConflictException(
            `Dish with name "${dishData.name}" already exists`,
          );
        }

        // Crear el plato
        const dish = queryRunner.manager.create(Dish, {
          name: dishData.name,
          description: dishData.description,
          image: dishData.image,
          UserId: dishData.UserId,
        });

        const savedDish = await queryRunner.manager.save(dish);

        // Create dishFoodItems relations
        const dishFoodItems = [];
        for (const ingredient of dishData.ingredients) {
          const foodItem = await this.foodItemService.deepFind(
            ingredient.barcode,
          );

          if (!foodItem) {
            throw new NotFoundException(
              `Food item with barcode ${ingredient.barcode} not found`,
            );
          }

          const dishFoodItem = queryRunner.manager.create(DishFoodItem, {
            dish: savedDish,
            foodItem: foodItem,
            quantity: ingredient.quantity,
          });

          dishFoodItems.push(dishFoodItem);
        }

        await queryRunner.manager.save(DishFoodItem, dishFoodItems);
        await queryRunner.commitTransaction();

        return savedDish;
      } catch (error) {
        await queryRunner.rollbackTransaction();

        // If it is the specific error and not the last attempt, retry
        if (
          error.message.includes('Record has changed since last read') &&
          attempt < maxRetries - 1
        ) {
          attempt++;
          await new Promise((resolve) => setTimeout(resolve, 100 * attempt)); // Delay incremental
          continue;
        }

        // If it is the specific error and not the last attempt, throw exception
        if (
          error instanceof ConflictException ||
          error instanceof NotFoundException
        ) {
          throw error;
        }

        throw new InternalServerErrorException(
          'An error occurred while creating the dish with ingredients',
        );
      } finally {
        await queryRunner.release();
      }
    }
  }

  // Nuevo: obtener platos formateados por usuario
  async findUserPlatesFormatted(userId: number): Promise<
    Array<{
      id: string;
      name: string;
      description?: string;
      image?: string;
      ingredients: string[];
      macros: { carbs: number; fat: number; protein: number };
    }>
  > {
    const dishes = await this.dishRepository
      .createQueryBuilder('dish')
      .leftJoinAndSelect('dish.dishFoodItems', 'dfi')
      .leftJoinAndSelect('dfi.foodItem', 'fi')
      .where('dish.UserId = :userId', { userId })
      .getMany();

    const result = dishes.map((dish) => {
      const ingredients = (dish.dishFoodItems || [])
        .map((dfi: DishFoodItem) => dfi?.foodItem?.name || 'unknown')
        .filter((name: string) => !!name);

      // Agregar macros totales del plato
      let totalCarbsG = 0;
      let totalFatG = 0;
      let totalProteinG = 0;
      for (const dfi of dish.dishFoodItems || []) {
        const qty = Number(dfi.quantity) || 0; //in grams
        const fi = dfi.foodItem;
        if (!fi || qty <= 0) continue;

        // asumimos macros por 100g
        const carbsPer100 = fi.carbohydrates ?? 0;
        const fatPer100 = fi.fat ?? 0;
        const proteinPer100 = fi.proteins ?? 0;

        totalCarbsG += (carbsPer100 * qty) / 100;
        totalFatG += (fatPer100 * qty) / 100;
        totalProteinG += (proteinPer100 * qty) / 100;
      }

      const macros = this.computeMacroPercents(
        totalCarbsG,
        totalFatG,
        totalProteinG,
      );

      return {
        id: String(dish.id),
        name: dish.name,
        description: dish.description,
        image: dish.image,
        ingredients,
        macros,
      };
    });

    return result;
  }

  private computeMacroPercents(
    carbsG: number,
    fatG: number,
    proteinG: number,
  ): { carbs: number; fat: number; protein: number } {
    const carbsCal = carbsG * 4;
    const fatCal = fatG * 9;
    const proteinCal = proteinG * 4;
    const totalCal = carbsCal + fatCal + proteinCal;

    if (!totalCal || totalCal <= 0) {
      return { carbs: 0, fat: 0, protein: 0 };
    }

    const rawCarbs = (carbsCal / totalCal) * 100;
    const rawFat = (fatCal / totalCal) * 100;
    const rawProtein = (proteinCal / totalCal) * 100;

    let carbs = Math.round(rawCarbs);
    let fat = Math.round(rawFat);
    let protein = Math.round(rawProtein);

    // Ajuste para que sumen 100
    let diff = 100 - (carbs + fat + protein);
    if (diff !== 0) {
      type MacroKey = 'carbs' | 'fat' | 'protein';

      const remainders: Array<{ key: MacroKey; rem: number }> = [
        { key: 'carbs', rem: rawCarbs - Math.floor(rawCarbs) },
        { key: 'fat', rem: rawFat - Math.floor(rawFat) },
        { key: 'protein', rem: rawProtein - Math.floor(rawProtein) },
      ];

      while (diff !== 0) {
        const target = remainders[0].key;
        if (diff > 0) {
          if (target === 'carbs') carbs++;
          else if (target === 'fat') fat++;
          else protein++;
          diff--;
        } else {
          if (target === 'carbs') carbs--;
          else if (target === 'fat') fat--;
          else protein--;
          diff++;
        }
      }
    }

    return { carbs, fat, protein };
  }

  async updateIngredients(
    dishId: number,
    updateData: UpdateDishIngredientsDto,
  ): Promise<Dish> {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Verify dish exists
        const dish = await queryRunner.manager.findOne(Dish, {
          where: { id: dishId },
        });

        if (!dish) {
          throw new NotFoundException(`Dish with ID ${dishId} not found`);
        }

        // Delete existing ingredients
        await queryRunner.manager.delete(DishFoodItem, {
          dish: { id: dishId },
        });

        // Create new ingredients
        const dishFoodItems = [];
        for (const ingredient of updateData.ingredients) {
          // Convertir barcode string a number
          const barcodeNumber = parseInt(ingredient.barcode, 10);

          const foodItem = await this.foodItemService.deepFind(barcodeNumber);

          if (!foodItem) {
            throw new NotFoundException(
              `Food item with barcode ${ingredient.barcode} not found`,
            );
          }

          const dishFoodItem = queryRunner.manager.create(DishFoodItem, {
            dish: dish,
            foodItem: foodItem,
            quantity: ingredient.quantity,
          });

          dishFoodItems.push(dishFoodItem);
        }

        // Save new ingredients
        await queryRunner.manager.save(DishFoodItem, dishFoodItems);
        await queryRunner.commitTransaction();

        // Return the plate updated
        const updatedDish = await this.dishRepository.findOne({
          where: { id: dishId },
          relations: ['dishFoodItems', 'dishFoodItems.foodItem'],
        });

        if (!updatedDish) {
          throw new InternalServerErrorException(
            `Dish with ID ${dishId} not found after update`,
          );
        }

        return updatedDish;
      } catch (error) {
        await queryRunner.rollbackTransaction();

        // If it is the specific error, retry

        if (
          error.message.includes('Record has changed since last read') &&
          attempt < maxRetries - 1
        ) {
          attempt++;
          await new Promise((resolve) =>
            setTimeout(resolve, 100 * Math.pow(2, attempt)),
          );
          continue;
        }

        // If it is other error
        throw error;
      } finally {
        await queryRunner.release();
      }
    }

    throw new InternalServerErrorException(
      'Failed to update ingredients after multiple attempts',
    );
  }

  async getDishesWithIngredientsByUser(userId: number): Promise<Dish[]> {
    return this.dishRepository
      .createQueryBuilder('dish')
      .leftJoinAndSelect('dish.dishFoodItems', 'dishFoodItems')
      .leftJoinAndSelect('dishFoodItems.foodItem', 'foodItem')
      .where('dish.UserId = :userId', { userId })
      .getMany();
  }
}
