import { IsString, IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserType } from 'src/user/userType.enum';

export class GoogleLoginDto {
  @IsString()
  @MinLength(1)
  googleId: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  username: string;

  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;
}
