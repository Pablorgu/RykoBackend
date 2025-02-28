import { IsOptional, IsString, IsEmail } from 'class-validator';

export class FilterAdminDto {
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