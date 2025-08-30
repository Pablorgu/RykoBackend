import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Day } from './day.entity';
import { MealTime } from 'src/meal/enums/mealTime.enum';
import { Meal } from 'src/meal/meal.entity';
import { MealDish } from 'src/mealDish/mealDish.entity';
import { MealDishFooditem } from 'src/mealDishFoodItem/mealDishFoodItem.entity';
import { Dish } from 'src/dish/dish.entity';
import { DishService } from 'src/dish/dish.service';
import { DishFoodItemService } from 'src/dishFoodItem/dishfooditem.service';
import { FoodItemService } from 'src/foodItem/fooditem.service';
import {
  DayDto,
  MealDto,
  MealItemDto,
  MealDishIngredientOverrideDto,
} from './dto/day.dto';

// Transform date to ISO format
function toISODate(dateInput: string | Date): string {
  if (typeof dateInput === 'string') {
    return dateInput.slice(0, 10); // "YYYY-MM-DD"
  }
  return dateInput.toISOString().slice(0, 10);
}

// Validate if the string is a valid date format
function isValidDateString(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr + 'T00:00:00.000Z');
  return !isNaN(date.getTime()) && dateStr === date.toISOString().slice(0, 10);
}

@Injectable()
export class DayService {
  // Order of the meals
  static readonly ORDER = [
    MealTime.BREAKFAST,
    MealTime.LUNCH,
    MealTime.SNACK,
    MealTime.DINNER,
    MealTime.APERITIVE,
  ];

  constructor(
    @InjectRepository(Day)
    private readonly dayRepo: Repository<Day>,
    @InjectRepository(Meal)
    private readonly mealRepo: Repository<Meal>,
    @InjectRepository(MealDish)
    private readonly mealDishRepo: Repository<MealDish>,
    @InjectRepository(MealDishFooditem)
    private readonly mealDishFoodItemRepo: Repository<MealDishFooditem>,
    @InjectRepository(Dish)
    private readonly dishRepo: Repository<Dish>,
    private readonly dishService: DishService,
    private readonly dishFoodItemService: DishFoodItemService,
    private readonly foodItemService: FoodItemService,
  ) {}

  //Create a new Day
  async create(dayData: Partial<Day>): Promise<Day> {
    if (!dayData.date) {
      throw new BadRequestException('La fecha es requerida');
    }

    const dateStr = toISODate(dayData.date);
    if (!isValidDateString(dateStr)) {
      throw new BadRequestException('Fecha inválida');
    }

    const newDay = this.dayRepo.create({
      ...dayData,
      date: dateStr,
    });
    return await this.dayRepo.save(newDay);
  }

  // Get all Days ordered by date
  async findAll(): Promise<Day[]> {
    return await this.dayRepo.find({
      order: { date: 'DESC' },
    });
  }

  //Get a single Day by ID
  async findOneById(id: number): Promise<Day> {
    const day = await this.dayRepo.findOne({ where: { id } });

    if (!day) {
      throw new NotFoundException(`No se encontró el día con ID ${id}`);
    }

    return day;
  }

  //Find days between two dates
  async findBetweenDates(
    startDate: string | Date,
    endDate: string | Date,
  ): Promise<Day[]> {
    const startDateStr = toISODate(startDate);
    const endDateStr = toISODate(endDate);

    return await this.dayRepo.find({
      where: {
        date: Between(startDateStr, endDateStr),
      },
      order: { date: 'ASC' },
    });
  }

  //Update a Day by ID
  async update(id: number, dayData: Partial<Day>): Promise<Day> {
    await this.findOneById(id);

    if (dayData.date) {
      const dateStr = toISODate(dayData.date);
      if (!isValidDateString(dateStr)) {
        throw new BadRequestException('Fecha inválida');
      }
      dayData.date = dateStr;
    }

    await this.dayRepo.update(id, dayData);
    return await this.findOneById(id);
  }

  //Delete a Day by ID

  async remove(id: number): Promise<string> {
    const result = await this.dayRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`No se encontró el día con ID ${id}`);
    } else {
      return 'Se ha eliminado el día con éxito';
    }
  }

  //Find a day by exact date
  async findByDate(date: string | Date): Promise<Day | null> {
    const dateStr = toISODate(date);
    return await this.dayRepo.findOne({
      where: { date: dateStr },
    });
  }

  async ensureDay(userId: number, dateInput: string): Promise<Day> {
    const iso = toISODate(dateInput); // "YYYY-MM-DD"

    if (!isValidDateString(iso)) {
      throw new BadRequestException(`Fecha inválida: ${dateInput}`);
    }

    // 1) Find if the day exist with ISO format
    let day = await this.dayRepo.findOne({
      where: { user: { id: userId }, date: iso },
      relations: [
        'meals',
        'meals.mealDishes',
        'meals.mealDishes.dish',
        'meals.mealDishes.foodItems',
        'meals.mealDishes.foodItems.foodItem',
      ],
    });

    // 2) If not exist, create it
    if (!day) {
      try {
        // Verify that the user exists
        const userExists = await this.dayRepo.manager.findOne('User', {
          where: { id: userId },
        });
        if (!userExists) {
          throw new Error(`Usuario con ID ${userId} no existe`);
        }

        const newDay = this.dayRepo.create({
          user: { id: userId },
          date: iso, // Use the ISO format
        });

        day = await this.dayRepo.save(newDay);

        // Reload with relations after creation
        day = await this.dayRepo.findOne({
          where: { id: day.id },
          relations: [
            'meals',
            'meals.mealDishes',
            'meals.mealDishes.dish',
            'meals.mealDishes.foodItems',
            'meals.mealDishes.foodItems.foodItem',
          ],
        });
      } catch (e: any) {
        console.error(`[ensureDay] Error al crear día:`, e.message);

        // Search using the same string iso format
        day = await this.dayRepo.findOne({
          where: { user: { id: userId }, date: iso },
          relations: [
            'meals',
            'meals.mealDishes',
            'meals.mealDishes.dish',
            'meals.mealDishes.foodItems',
            'meals.mealDishes.foodItems.foodItem',
          ],
        });
      }
    }

    // Verify that day is not null
    if (!day) {
      throw new Error(
        `No se pudo crear o encontrar el día para userId: ${userId}, fecha: ${dateInput}`,
      );
    }

    // 3) Guarantee the 5 meals
    const existing = new Set((day.meals ?? []).map((m) => m.type));
    const toCreate = DayService.ORDER.filter(
      (t) => !existing.has(t as MealTime),
    ).map((type) =>
      this.mealRepo.create({
        day: day as Day,
        type: type as MealTime,
      }),
    );

    if (toCreate.length) {
      await this.mealRepo.save(toCreate);

      // Reload with relations after creation
      day = await this.dayRepo.findOne({
        where: { id: day.id },
        relations: [
          'meals',
          'meals.mealDishes',
          'meals.mealDishes.dish',
          'meals.mealDishes.foodItems',
          'meals.mealDishes.foodItems.foodItem',
        ],
      });

      if (!day) {
        throw new Error(
          `Error al recargar el día después de crear las comidas`,
        );
      }
    }
    return day;
  }

  async getDayDTO(userId: number, dateInput: string): Promise<DayDto> {
    const day = await this.ensureDay(userId, dateInput);

    const meals = day.meals || [];

    const byType = new Map(meals.map((m) => [m.type, m]));
    const dtoMeals: MealDto[] = DayService.ORDER.map((typeKey) => {
      const m = byType.get(typeKey as MealTime);
      const items: MealItemDto[] = (m?.mealDishes ?? []).map((md) => ({
        mealDishId: md.id,
        dishId: md.dish.id,
        overrides: (md.foodItems ?? []).map(
          (fi) =>
            ({
              ingredientId: fi.foodItem.barcode as unknown as number,
              grams: fi.quantity,
            }) as MealDishIngredientOverrideDto,
        ),
      }));
      return {
        type: typeKey as MealTime,
        items,
      };
    });

    return {
      id: day.id,
      date: day.date,
      meals: dtoMeals,
    };
  }

  async addDish(
    userId: number,
    date: string,
    type: MealTime,
    dishId: number,
  ): Promise<MealItemDto> {
    // 1. Make sure the day exist with the relation meals
    const day = await this.ensureDay(userId, date);

    // 2. Search the Meal corresponding by day and type
    const meal = day.meals?.find((m) => m.type === type);
    if (!meal) {
      throw new BadRequestException(
        `No existe meal de tipo ${type} en ese día`,
      );
    }

    // 3. Validate that the Dish exists using the service
    const dish = await this.dishService.findOneById(dishId);
    if (!dish) {
      throw new NotFoundException(`Dish con ID ${dishId} no encontrado`);
    }

    // 4. Obtain the DishFoodItems associated to the Dish
    const dishFoodItems = await this.dishFoodItemService.findByDishId(dishId);

    // 5. Create the MealDish
    const mealDish = this.mealDishRepo.create({
      meal: { id: meal.id },
      dish: { id: dish.id },
      position: 0,
    });
    const savedMealDish = await this.mealDishRepo.save(mealDish);

    // 6.Copy all the DishFoodItems as MealDishFoodItems
    const overrides: MealDishIngredientOverrideDto[] = [];

    if (dishFoodItems.length > 0) {
      const mealDishFoodItems = dishFoodItems.map((dishFoodItem) => {
        return this.mealDishFoodItemRepo.create({
          mealDish: savedMealDish,
          foodItem: dishFoodItem.foodItem,
          quantity: dishFoodItem.quantity,
        });
      });

      await this.mealDishFoodItemRepo.save(mealDishFoodItems);

      overrides.push(
        ...dishFoodItems.map((dishFoodItem) => ({
          ingredientId: dishFoodItem.foodItem.barcode,
          grams: dishFoodItem.quantity,
        })),
      );
    }

    // 7.Return the MealItemDto
    const result = {
      mealDishId: savedMealDish.id,
      dishId: dish.id,
      overrides,
    };
    return result;
  }

  // Update the ingredient of a mealDish
  async updateIngredient(
    userId: number,
    date: string,
    type: MealTime,
    mealDishId: number,
    ingredientId: number,
    grams: number,
  ): Promise<MealDishIngredientOverrideDto> {
    // 1. Validate that grams >= 0
    if (grams < 0) {
      throw new BadRequestException('Los gramos deben ser mayor o igual a 0');
    }

    // 2. Validate that foodItem exist
    const foodItem = await this.foodItemService.findOneByBarcode(ingredientId);
    if (!foodItem) {
      throw new NotFoundException(
        `Ingrediente con ID ${ingredientId} no encontrado`,
      );
    }

    // 3. Search the MealDish
    const mealDish = await this.mealDishRepo.findOne({
      where: { id: mealDishId },
      relations: ['meal', 'meal.day', 'meal.day.user'],
    });

    if (!mealDish) {
      throw new NotFoundException(
        `MealDish con ID ${mealDishId} no encontrado`,
      );
    }

    // Validate that the mealDish belongs to the user, date and type
    if (
      mealDish.meal.day.date !== date ||
      mealDish.meal.type !== type ||
      mealDish.meal.day.user.id !== userId
    ) {
      throw new NotFoundException(
        'El MealDish no corresponde al usuario, día o tipo de comida especificado',
      );
    }

    // 4.Search the MealDishFoodItem
    const mealDishFoodItem = await this.mealDishFoodItemRepo.findOne({
      where: {
        mealDish: { id: mealDishId },
        foodItem: { barcode: ingredientId },
      },
      relations: ['mealDish', 'foodItem'],
    });

    console.log('mealDishFoodItem encontrado:', mealDishFoodItem);
    console.log('mealDishFoodItem.id:', mealDishFoodItem?.id);
    console.log('grams a actualizar:', grams);

    if (!mealDishFoodItem) {
      throw new NotFoundException(
        `Ingrediente con ID ${ingredientId} no encontrado en el MealDish ${mealDishId}`,
      );
    }

    // 5.Update quantity
    const updateResult = await this.mealDishFoodItemRepo.update(
      mealDishFoodItem.id,
      {
        quantity: grams,
      },
    );

    console.log('Resultado de actualización:', updateResult);

    // 6. Return the override updated
    return {
      ingredientId: ingredientId,
      grams: grams,
    };
  }

  async removeDish(
    userId: number,
    date: string,
    type: MealTime,
    mealDishId: number,
  ): Promise<DayDto> {
    // 1. Validate date format
    if (!isValidDateString(date)) {
      throw new BadRequestException(
        'Formato de fecha inválido. Use YYYY-MM-DD',
      );
    }

    // 2. Ensure day existence
    const day = await this.ensureDay(userId, date);

    // 3. Search meal specified type
    const meal = await this.mealRepo.findOne({
      where: {
        day: { id: day.id },
        type: type,
      },
      relations: ['day'],
    });

    if (!meal) {
      throw new NotFoundException(
        `No se encontró una comida de tipo ${type} para la fecha ${date}`,
      );
    }

    // 4. Search the MealDish and validate that it belongs to the correct Meal
    const mealDish = await this.mealDishRepo.findOne({
      where: { id: mealDishId },
      relations: ['meal', 'meal.day', 'meal.day.user'],
    });

    if (!mealDish) {
      throw new NotFoundException(
        `MealDish con ID ${mealDishId} no encontrado`,
      );
    }

    // Validate that the mealDish belongs to the user, date and type
    if (
      mealDish.meal.day.date !== date ||
      mealDish.meal.type !== type ||
      mealDish.meal.day.user.id !== userId
    ) {
      throw new NotFoundException(
        'El MealDish no corresponde al usuario, día o tipo de comida especificado',
      );
    }

    // 5. Delete the MealDish (cascading will delete the MealDishFoodItems)
    await this.mealDishRepo.remove(mealDish);

    return this.getDayDTO(userId, date);
  }
}
