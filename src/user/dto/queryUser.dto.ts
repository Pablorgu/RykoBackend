import { IsOptional, IsString, IsEmail, IsEnum, IsInt, IsNumber, IsDateString, IsArray } from 'class-validator';

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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  intolerances?: string[];
}
