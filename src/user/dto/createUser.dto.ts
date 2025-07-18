import { IsString, MinLength } from 'class-validator';
import { UserProfileDto } from './UserProfile.dto';

export class CreateUserDto extends UserProfileDto {
  @IsString()
  @MinLength(6)
  password: string;
}
