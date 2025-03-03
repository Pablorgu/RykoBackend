import { IsOptional, IsString, IsEmail, IsEnum, IsInt, IsNumber, IsDateString } from 'class-validator';
import { CreateUserDto } from './createUser.dto';  // Importa tu DTO de creación si ya lo tienes

export class QueryUserDto {
  
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsInt()
  height?: number;

  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @IsOptional()
  @IsEnum(['weight_loss', 'weight_maintain', 'weight_gain'])
  aim?: 'weight_loss' | 'weight_maintain' | 'weight_gain';

  @IsOptional()
  @IsInt()
  calorie_goal?: number;
}
