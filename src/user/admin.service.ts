import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { Repository } from 'typeorm';



@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>) {}

  //Devuelve todos los administradores
  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

    //Devuelve un administrador por su id
    async findOneById(id: number): Promise<Admin> {
      const admin = await this.adminRepository.findOne({ where: { id }});
      if
      (!admin) {
        throw new NotFoundException(`Admin with id ${id} not found`);
      }
      return admin;
    }

    //Devuelve un administrado por su email
    async findOneByEmail(email: string): Promise<Admin> {
      const admin = await this.adminRepository.findOne({ where: { email }});
      if
      (!admin) {
        throw new NotFoundException(`Admin with email ${email} not found`);
      }
      return admin
    }

  //Filtra administradores por algun atributo
  async filterAdmins(filters: Partial<Admin>): Promise<Admin[]> {
    const queryBuilder = this.adminRepository.createQueryBuilder('admin');

    // Recorre las claves de los filtros y los añade a la consulta
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
      queryBuilder.andWhere(`admin.${key} LIKE :${key}`, { [key]: `%${value}%` });
      }
    }

    // Ejecuta la consulta
    return await queryBuilder.getMany();
  }

  //Crea un administrador
  async create(adminData: Partial<Admin>): Promise<Admin> {
    const admin = this.adminRepository.create(adminData);
    await this.adminRepository.save(admin);
    return admin;
  }
 
  //Actualiza un administrador de uno o mas atributos
  async update(id: number, adminData: Partial<Admin>): Promise<Admin> {
    const admin = await this.findOneById(id);
    await this.adminRepository.update(id, adminData);
    return admin;
  }

  //Elimina un administrador
  async remove(id: number): Promise<Admin> {
    const admin = await this.findOneById(id);
    await this.adminRepository.remove(admin);
    return admin;
  }
}


