import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsIn,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';
import { WeightAim } from '../enums/weightAim.enum';
import { Gender } from '../enums/gender.enum';

export class UpdateProfileDto {
  @IsDateString()
  fecha: string;

  @IsString()
  @IsIn([Gender.MALE, Gender.FEMALE, Gender.OTHER])
  genero: Gender;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsString()
  @IsNotEmpty()
  peso: string;

  @IsString()
  @IsNotEmpty()
  altura: string;

  @IsString()
  @IsIn([WeightAim.LOSS, WeightAim.MAINTAIN, WeightAim.GAIN])
  objetivo: WeightAim;

  @IsString()
  @IsOptional()
  calorias: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  intolerancias: string[];
}
