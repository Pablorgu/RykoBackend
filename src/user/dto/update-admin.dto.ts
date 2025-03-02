import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()  
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;
}