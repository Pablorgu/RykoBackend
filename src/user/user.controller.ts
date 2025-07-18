import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { QueryUserDto } from './dto/queryUser.dto';
import { error } from 'console';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Gender } from './enums/gender.enum';
import { WeightAim } from './enums/weightAim.enum';
import { UserFullProfileDto } from './dto/user-full-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() CreateUserDto: CreateUserDto) {
    try {
      console.log('Este es el dto del usuario:', CreateUserDto);
      // Check if the email is already registered
      const existingUser = await this.userService.findOneByEmail(
        CreateUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
      //Proceed to create the user
      return this.userService.create(CreateUserDto);
    } catch {
      // If the error is a conflict exception, throw it
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating user',
      );
    }
  }

  @Get('filter')
  async filter(@Query() filters: QueryUserDto): Promise<User[]> {
    return this.userService.filterUsers(filters);
  }

  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }
    return this.userService.findOneById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() UpdateUserDto: QueryUserDto,
  ): Promise<User> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }

    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.userService.update(id, UpdateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<string> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }
    const result = await this.userService.remove(id);
    if (result) {
      return 'User with id ${id} has been succesfully deleted';
    } else {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  @Put('update-profile/:id')
  async updateProfile(
    @Param('id') id: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }

    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    try {
      console.log(`DTO recibido:`, updateProfileDto);
      const updateData = {
        ...(updateProfileDto.username && {
          username: updateProfileDto.username,
        }),
        ...(updateProfileDto.email && { email: updateProfileDto.email }),
        birthdate: updateProfileDto.birthdate,
        gender: updateProfileDto.gender,
        country: updateProfileDto.country,
        weight: updateProfileDto.weight,
        height: updateProfileDto.height,
        aim: updateProfileDto.aim,
        calorieGoal: updateProfileDto.calorieGoal,
        intolerances: updateProfileDto.intolerances,
        proteinPct: updateProfileDto.proteinPct,
        carbsPct: updateProfileDto.carbsPct,
        fatPct: updateProfileDto.fatPct,
      };
      console.log('datos a actualizar:', updateData);

      return await this.userService.update(id, updateData);
    } catch (error) {
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating user profile',
      );
    }
  }

  @Get('profile/:id')
  @UseGuards(JwtAuthGuard)
  async getFullProfile(@Param('id') id: number): Promise<UserFullProfileDto> {
    if (!id) {
      throw new BadRequestException('Id is required');
    }
    return this.userService.getFullProfile(id);
  }
}
