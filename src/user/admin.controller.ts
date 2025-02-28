import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { FilterAdminDto } from './dto/filter-admin.dto';

@Controller('admins')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get()
    async findAll(): Promise<Admin[]> {
        return this.adminService.findAll();
    }

    @Post()
    async create(@Body() CreateAdminDto: CreateAdminDto){
        return this.adminService.create(CreateAdminDto);
    }

    @Get('filter')
    async filter(@Query() filters: FilterAdminDto): Promise<Admin[]> {
      return this.adminService.filterAdmins(filters);
    }
}
