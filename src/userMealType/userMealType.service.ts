
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserMealType } from "./userMealType.entity";
import { CreateUserMealTypeDto } from "./dto/createUserMealType.dto";
import { QueryUserMealTypeDto } from "./dto/queryUserMealType.dto";

@Injectable()
export class UserMealTypeService {
  constructor(
    @InjectRepository(UserMealType)
    private readonly mealTypeRepository: Repository<UserMealType>,
  ) { }


  //Create a new mealtype
  async create(createMealTypeDto: CreateUserMealTypeDto): Promise<UserMealType> {
    const { userId, mealTypeId, order, name } = createMealTypeDto;

    // Validación de duplicado
    const existing = await this.mealTypeRepository.findOne({
      where: {
        user: { id: userId },
        order,
      },
      relations: ['user'],
    });

    if (existing) {
      throw new BadRequestException(`User with id ${userId} already has a meal type with order ${order}`);
    }

    try {
      const mealType = this.mealTypeRepository.create({
        user: { id: userId },
        meal: { id: mealTypeId },
        name,
        order,
      });

      return await this.mealTypeRepository.save(mealType);
    } catch (error) {
      throw new BadRequestException('Failed to create UserMealType');
    }
  }


  //Find All the mealtypes
  async findAll(): Promise<UserMealType[]> {
    return this.mealTypeRepository.find();
  }

  //Find a mealtype by its id
  async findOneById(id: number): Promise<UserMealType> {
    const mealType = await this.mealTypeRepository.findOne({ where: { id } });
    if (!mealType) {
      throw new NotFoundException(`UserMealType with id ${id} not found`);
    }
    return mealType;
  }

  //Find All the mealstype related to an user
  async findByUserId(userId: number): Promise<UserMealType[]> {
    const mealTypes = await this.mealTypeRepository.find({ where: { user: { id: userId } } });
    if (!mealTypes || mealTypes.length === 0) {
      throw new NotFoundException(`No UserMealType found for user with id ${userId}`);
    }
    return mealTypes;
  }

  //Find All the mealstype related to an meal
  async findByMealId(mealId: number): Promise<UserMealType[]> {
    const mealTypes = await this.mealTypeRepository.find({ where: { meal: { id: mealId } } });
    if (!mealTypes || mealTypes.length === 0) {
      throw new NotFoundException(`No UserMealType found for meal with id ${mealId}`);
    }
    return mealTypes;
  }

  //Update a mealtype by its id
  async update(id: number, updateMealTypeDto: QueryUserMealTypeDto): Promise<UserMealType> {
    const exists = await this.mealTypeRepository.findOne({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`UserMealType with id ${id} not found`);
    }

    await this.mealTypeRepository.update(id, updateMealTypeDto);
    return this.findOneById(id);
  }
  //Delete a mealtype by its id
  async remove(id: number): Promise<string> {
    const result = await this.mealTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`UserMealType with id ${id} not found`);
    } else {
      return `UserMealType with id ${id} deleted successfully`;
    }
  }
}

