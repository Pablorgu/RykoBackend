import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUser } from './baseUser.entity';

@Injectable()
export class BaseUserService {
  constructor(
    @InjectRepository(BaseUser)
    private readonly userRepository: Repository<BaseUser>,
  ) { }
  //Crear un nuevo registro en la tabla BaseUser
  async createUser(name: string, email: string, password: string,): Promise<BaseUser> {
    const user = new BaseUser();
    user.username = name;
    user.email = email;
    user.password = password;
    return this.userRepository.save(user);
  }

  //Obtener todos los registros de la tabla BaseUser
  async findAll(): Promise<BaseUser[]> {
    return this.userRepository.find();
  }

  //Obtener un usuario por su id
  async findOne(id: number): Promise<BaseUser> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  //Actualizar un usuario por su id
  async update(id: number, name: string, email: string, password: string): Promise<BaseUser> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    user.username = name;
    user.email = email;
    user.password = password;
    return this.userRepository.save(user);
  }

  //Eliminar un usuario por su id
  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    await this.userRepository.remove(user);
  }
}
