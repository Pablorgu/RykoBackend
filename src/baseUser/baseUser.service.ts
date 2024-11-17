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

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<BaseUser> {
    const user = new BaseUser();
    user.username = name;
    user.email = email;
    user.password = password;
    return this.userRepository.save(user);
  }

  async findAll(): Promise<BaseUser[]> {
    return this.userRepository.find();
  }
}
