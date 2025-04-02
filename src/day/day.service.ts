import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { Day } from "./day.entity";

@Injectable()
export class DayService {
  constructor(
    @InjectRepository(Day)
    private readonly dayRepository: Repository<Day>
  ) { }
  /**
   * Create a new Day
   */
  async create(dayData: Partial<Day>): Promise<Day> {
    if (!dayData.date) {
      throw new BadRequestException('La fecha es requerida');
    }

    // Validar que la fecha sea válida
    if (!(dayData.date instanceof Date) && isNaN(new Date(dayData.date).getTime())) {
      throw new BadRequestException('Fecha inválida');
    }

    const newDay = this.dayRepository.create(dayData);
    return await this.dayRepository.save(newDay);
  }

  /**
   * Get all Days ordered by date
   */
  async findAll(): Promise<Day[]> {
    return await this.dayRepository.find({
      order: { date: 'DESC' }
    });
  }

  /**
   * Get a single Day by ID
   */
  async findOneById(id: number): Promise<Day> {
    const day = await this.dayRepository.findOne({ where: { id } });

    if (!day) {
      throw new NotFoundException(`No se encontró el día con ID ${id}`);
    }

    return day;
  }


  /**
   * Find days between two dates
   */
  async findBetweenDates(startDate: Date, endDate: Date): Promise<Day[]> {
    return await this.dayRepository.find({
      where: {
        date: Between(startDate, endDate)
      },
      order: { date: 'ASC' }
    });
  }

  /**
   * Update a Day by ID
   */
  async update(id: number, dayData: Partial<Day>): Promise<Day> {
    // Firstly we determine if the day exists
    await this.findOneById(id);

    if (dayData.date && !(dayData.date instanceof Date) && isNaN(new Date(dayData.date).getTime())) {
      throw new BadRequestException('Fecha inválida');
    }

    await this.dayRepository.update(id, dayData);
    return await this.findOneById(id);
  }

  /**
   * Delete a Day by ID
   */
  async remove(id: number): Promise<string> {
    const result = await this.dayRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`No se encontró el día con ID ${id}`);
    } else {
      return "Se ha eliminado el día con éxito";
    }
  }

  /**
   * Find a day by exact date
   */
  async findByDate(date: Date): Promise<Day | null> {
    return await this.dayRepository.findOne({
      where: { date }
    });
  }
}

