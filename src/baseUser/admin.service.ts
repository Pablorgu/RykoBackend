import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { User } from './user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}
  //Crear un nuevo registro en la tabla Admin
  async createUser(name: string) {
    const user = new User();
    user.username = name;
  }
  //Obtener todos los registros de la tabla Admin
  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  //Obtener un admin por su id
  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new Error(`Admin with id ${id} not found`);
    }
    return admin;
  }

  //Actualizar un admin por su id
  async update(id: number, name: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new Error(`Admin with id ${id} not found`);
    }
    admin.username = name;
    return this.adminRepository.save(admin);
  }

  //Eliminar un admin por su id
  async remove(id: number): Promise<void> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new Error(`Admin with id ${id} not found`);
    }
    await this.adminRepository.remove(admin);
  }
}


