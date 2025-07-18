import {
  IsString,
  IsEmail,
  IsDateString,
  IsISO31661Alpha2,
  IsIn,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsArray,
  MinLength,
} from 'class-validator';
import { Gender } from '../enums/gender.enum';
import { WeightAim } from '../enums/weightAim.enum';

export class UserProfileDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsDateString()
  birthdate: string;

  @IsOptional()
  @IsIn([Gender.MALE, Gender.FEMALE, Gender.OTHER])
  gender?: Gender;

  @IsOptional()
  @IsISO31661Alpha2()
  country?: string;

  @IsInt()
  @Min(1)
  weight: number;

  @IsInt()
  @Min(1)
  height: number;

  @IsEnum(WeightAim)
  aim: WeightAim;

  @IsInt()
  calorieGoal: number;

  @IsInt()
  proteinPct: number;

  @IsInt()
  carbsPct: number;

  @IsInt()
  fatPct: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  intolerances?: string[];
}
