import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { BaseUserService } from './baseUser.service';
import { BaseUser } from './baseUser.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  )
  async createUser(name: string, email: string, password: string): Promise<BaseUser> {

  }
}
