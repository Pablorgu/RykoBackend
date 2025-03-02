import { Controller, Get, Post, Body, Query, Put, Param, Delete, BadRequestException, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { FilterAdminDto } from './dto/filter-admin.dto';
import { Filter } from 'typeorm';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admins')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get()
    async findAll(): Promise<Admin[]> {
        return this.adminService.findAll();
    }

    @Post()
    async create(@Body() CreateAdminDto: CreateAdminDto) {
        try {
            // Verifica si el email ya está registrado
            const existingAdmin = await this.adminService.findOneByEmail(CreateAdminDto.email);
            if (existingAdmin) {
                throw new ConflictException('Admin with this email already exists');
            }

            // Procede a crear el nuevo admin
            return this.adminService.create(CreateAdminDto);
        } catch (error) {
            // Si ocurre un error inesperado, lanzamos una excepción genérica
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('An unexpected error occurred while creating admin');
        }
    }

    @Get('filter')
    async filter(@Query() filters: FilterAdminDto): Promise<Admin[]> {
      return this.adminService.filterAdmins(filters);
    }

    @Get(':id')
    async findOneById(@Param('id') id: number): Promise<Admin> {
        if (!id) {
            throw new BadRequestException('Id is required'); // Excepción personalizada
        }
      return this.adminService.findOneById(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() UpdateAdminDto: UpdateAdminDto): Promise<Admin> {
        if (!id) {
            throw new BadRequestException('Id is required'); // Excepción personalizada
        }
        
        const admin = await this.adminService.findOneById(id);
        if (!admin) {
            throw new NotFoundException(`Admin with id ${id} not found`);
        }

    return this.adminService.update(id, UpdateAdminDto);
}

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<string> {
        if (!id) {
            throw new BadRequestException('Id is required');
        }
        const result = await this.adminService.remove(id);
        if (result) {
            return `Admin with id ${id} has been successfully deleted.`;
        } else {
            return `Failed to delete admin with id ${id}.`;
        }
    }
}
