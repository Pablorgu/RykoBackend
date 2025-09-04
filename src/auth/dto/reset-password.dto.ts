import { IsEmail, IsString, MinLength, Length, IsNumberString } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  email: string;

  @IsNumberString({}, { message: 'El código debe contener solo números' })
  @Length(6, 6, { message: 'El código debe tener exactamente 6 dígitos' })
  code: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  newPassword: string;
}