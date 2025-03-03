import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { BaseUser } from './baseUser.entity';

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
        queryBuilder.andWhere(`user.${key} LIKE :${key}`, { [key]: `%${value}%` });
      }
    }

    // Execute the query
    return await queryBuilder.getMany();
  }

  //Crea un usuario
  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    await this.userRepository.save(user);
    return user;
  }

  //Actualiza un usuario de uno o mas atributos
  async update(id: number, userData: Partial<User>): Promise<User>{
    const user = await this.findOneById(id);
    await  this.userRepository.update(id, userData);
    return this.findOneById(id);
  }

  //Método para eliminar un usuario por su id
  async remove(id:number): Promise<User> {
    const user = await this.findOneById(id);
    await this.userRepository.remove(user);
    return user;  
  }
}
