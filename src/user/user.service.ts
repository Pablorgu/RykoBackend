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

  //Método para insertar un nuevo registro en la tabla User
  async create(username: string, weight: number, height: number, birthdate: Date, aim: Aim, calorie_goal: number): Promise<User> {
    const newUser = new User();
    newUser.username = username;
    newUser.weight = weight;
    newUser.height = height;
    newUser.birthdate = birthdate;
    newUser.aim =  aim;
    newUser.calorie_goal = calorie_goal;
    
    return this.userRepository.save(newUser);
  }

  //Método para obtener todos los registros de la tabla User
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  //Método para obtener un usuario por su id
  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error(`User with id ${username} not found`);
    }
    return user;
  }

  //Método para actualizar un usuario por su username
  async update(username: string, weight: number, height: number, birthdate: Date, aim: Aim, calorie_goal: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error(`User with id ${username} not found`);
    }
    user.weight = weight;
    user.height = height;
    user.birthdate = birthdate;
    user.aim = aim;
    user.calorie_goal = calorie_goal;

    //tener en cuenta que no tengo por que modificar todos los campos pero aqui mando desde el form los que ya estan
    return this.userRepository.save(user);
  }

  //Método para eliminar un usuario por su id
  async remove(username: string): Promise<String> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      await this.userRepository.remove(user);
      return 'Deleted succesfully';
    }else{
      throw new Error(`User with id ${username} not found`);
    }
  }
}
