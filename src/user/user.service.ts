import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { BaseUser } from './baseUser.entity';
import { UserFullProfileDto } from './dto/user-full-profile.dto';
import { Gender } from './enums/gender.enum';
import { WeightAim } from './enums/weightAim.enum';

export enum Aim {
  WEIGHT_LOSS = 'weight_loss',
  WEIGHT_MAINTAIN = 'weight_maintain',
  WEIGHT_GAIN = 'weight_gain',
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //Devuelve todos los usuarios existentes
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  //Find an User by its id
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }
  //Obtiene un usuario por su email
  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  //Filter users by any attribute
  async filterUsers(filters: Partial<User>): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Iterates through the filter keys and adds them to the query.
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        queryBuilder.andWhere(`user.${key} LIKE :${key}`, {
          [key]: `%${value}%`,
        });
      }
    }

    // Execute the query
    return await queryBuilder.getMany();
  }

  //Crea un usuario
  async create(userData: Partial<User>): Promise<User> {
    // Calculate automatic calorie goal if not provided
    if (userData.calorieGoal === -1 && this.canCalculateCalories(userData)) {
      userData.calorieGoal = this.calculateHarrisBenedictCalories(userData);
    }

    const user = this.userRepository.create(userData);
    await this.userRepository.save(user);
    return user;
  }

  // Check if we have the required data to calculate calories
  private canCalculateCalories(userData: Partial<User>): boolean {
    const canCalculate = !!(
      userData.weight &&
      userData.height &&
      userData.birthdate &&
      userData.gender &&
      userData.aim
    );

    return canCalculate;
  }

  // Calculate calories using Harris-Benedict formula
  private calculateHarrisBenedictCalories(userData: Partial<User>): number {
    const weight = userData.weight!;
    const height = userData.height!;
    const birthdate = userData.birthdate!;
    const gender = userData.gender!;
    const aim = userData.aim;

    // Calculate age from birthdate
    const age = this.calculateAge(birthdate);

    // Harris-Benedict formula for BMR (Basal Metabolic Rate)
    let bmr: number;
    if (gender === 'male') {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else if (gender === 'female') {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    } else {
      // For 'other' gender, use average of male and female formulas
      const maleBmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
      const femaleBmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
      bmr = (maleBmr + femaleBmr) / 2;
    }

    // Apply activity factor
    const activityFactor = 1.55; // Moderate activity (3-5 days/week)
    let totalCalories = bmr * activityFactor;

    // Adjust based on weight aim
    if (aim === 'weight_loss') {
      totalCalories -= 500;
    } else if (aim === 'weight_gain') {
      totalCalories += 500;
    }

    return Math.round(totalCalories);
  }

  // Calculate age from birthdate string
  private calculateAge(birthdate: string): number {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  //Actualiza un usuario de uno o mas atributos
  async update(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.findOneById(id);
    let updateData = { ...userData };

    // If calorieGoal is not provided or is -1, calculate it automatically
    if (!userData.calorieGoal || userData.calorieGoal === -1) {
      // Merge current user data with update data to check if we can calculate
      // Ensure we have all required fields from the database
      const mergedData = {
        weight: userData.weight || user.weight,
        height: userData.height || user.height,
        birthdate: userData.birthdate || user.birthdate,
        gender: userData.gender || user.gender,
        aim: userData.aim || user.aim,
      };

      if (this.canCalculateCalories(mergedData)) {
        updateData.calorieGoal =
          this.calculateHarrisBenedictCalories(mergedData);
      } else if (userData.calorieGoal === -1) {
        // If we can't calculate and calorieGoal was explicitly set to -1, exclude it from update
        const { calorieGoal, ...restData } = updateData;
        updateData = restData;
      }
    }

    await this.userRepository.update(id, updateData);
    return this.findOneById(id);
  }

  //Método para eliminar un usuario por su id
  async remove(id: number): Promise<User> {
    const user = await this.findOneById(id);
    await this.userRepository.remove(user);
    return user;
  }

  // Método para obtener el perfil completo del usuario
  async getFullProfile(id: number): Promise<UserFullProfileDto> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      country: user.country,
      gender: user.gender as Gender,
      weight: user.weight,
      height: user.height,
      birthdate: user.birthdate,
      aim: user.aim as WeightAim,
      calorieGoal: user.calorieGoal,
      intolerances: user.intolerances,
      proteinPct: user.proteinPct,
      carbsPct: user.carbsPct,
      fatPct: user.fatPct,
    };
  }
}
