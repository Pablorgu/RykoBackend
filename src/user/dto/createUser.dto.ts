import { IsString, IsEmail, IsInt, IsEnum, IsOptional, Min, MinLength, IsISO31661Alpha2, IsIn, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsISO31661Alpha2()
  country?: string;

  @IsOptional()
  @IsIn(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';

  @IsInt()
  @Min(1)
  weight: number;

  @IsInt()
  @Min(1)
  height: number;

  @IsString()
  birthdate: string;

  @IsEnum(['weight_loss', 'weight_maintain', 'weight_gain'])
  aim: 'weight_loss' | 'weight_maintain' | 'weight_gain';

  @IsInt()
  @Min(1)
  calorie_goal: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  intolerances?: string[];
}
