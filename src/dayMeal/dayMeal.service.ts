import { Injectable } from "@nestjs/common";
import { DayMeal } from "./dayMeal.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MealService } from "src/meal/meal.service";
import { CreateDayMealDto } from "./dto/createDayMeal.dto";
import { DayService } from "src/day/day.service";


@Injectable()
export class DayMealService {
  constructor(
    @InjectRepository(DayMeal)
    private readonly dayMealRepository: Repository<DayMeal>,
    private readonly mealService: MealService,
    private readonly dayService: DayService,
  ) { }

  async create(createDayMealDto: CreateDayMealDto): Promise<DayMeal> {
    const { mealId, dayId } = createDayMealDto;

    // Searching the entities
    const meal = await this.mealService.findOneById(mealId);
    const day = await this.dayService.findOneById(dayId);

    // Checking that the entities exist
    if (!meal || !day) {
      throw new Error('Meal or Day not found');
    }

    // Creating the DayMeal entity
    const dayMeal = this.dayMealRepository.create({
      meal,
      day,
    });

    return this.dayMealRepository.save(dayMeal);
  }

  // Find all Days associated with a specific Meal
  async findByMealId(mealId: number): Promise<DayMeal[]> {
    return this.dayMealRepository.find({
      where: { meal: { id: mealId } }, // Access the id inside the related Meal entity
      relations: ['meal', 'day'], // Load related entities if needed
    });
  }

  // Find all Meals associated with a specific Day
  async findByDayId(dayId: number): Promise<DayMeal[]> {
    return this.dayMealRepository.find({
      where: { day: { id: dayId } }, // Access the id inside the related Day entity
      relations: ['meal', 'day'], // Load related entities if needed
    });
  }

  // Update a DayMeal Relation
  async update(id: number, dataMeal: Partial<DayMeal>): Promise<DayMeal | null> {
    await this.dayMealRepository.update(id, dataMeal);
    return this.dayMealRepository.findOne({ where: { id } });
  }


  async remove(id: number): Promise<string> {
    const dayMeal = await this.dayMealRepository.findOne({ where: { id } });
    if (!dayMeal) {
      throw new Error('DayMeal not found');
    }
    await this.dayMealRepository.remove(dayMeal);
    return 'DayMeal deleted successfully';
  }
}
