import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { User } from './user.entity';

@Injectable():
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly userRepository: Repository<User>,
  )
  async createUser(name: string) {
    const user = new User();
    user.username = username;
  }
}


