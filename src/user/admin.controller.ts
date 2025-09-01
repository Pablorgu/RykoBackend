import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Put,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { QueryAdminDto } from './dto/queryAdmin.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() CreateAdminDto: CreateAdminDto) {
    try {
      console.log('Este es el dto del admin:', CreateAdminDto);
      // Check if the email is already registered
      const existingAdmin = await this.adminService.findOneByEmail(
        CreateAdminDto.email,
      );
      if (existingAdmin) {
        throw new ConflictException('Admin with this email already exists');
      }
      console.log('No existe el email');

      // Proceed to create the admin
      return this.adminService.create(CreateAdminDto);
    } catch (error) {
      // If the error is a conflict exception, throw it
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating admin',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter')
  async filter(@Query() filters: QueryAdminDto): Promise<Admin[]> {
    return this.adminService.filterAdmins(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<Admin> {
    if (!id) {
      throw new BadRequestException('Id is required'); // Excepción personalizada
    }
    return this.adminService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() UpdateAdminDto: QueryAdminDto,
  ): Promise<Admin> {
    if (!id) {
      throw new BadRequestException('Id is required'); // Excepción personalizada
    }

    const admin = await this.adminService.findOneById(id);
    if (!admin) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }

    return this.adminService.update(id, UpdateAdminDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<string> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }
    const result = await this.adminService.remove(id);
    if (result) {
      return `Admin with id ${id} has been successfully deleted.`;
    } else {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
  }
}
