import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { PasswordResetService } from './password-reset.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class PasswordResetController {
  private readonly logger = new Logger(PasswordResetController.name);
  private readonly rateLimitMap = new Map<
    string,
    { count: number; resetTime: number }
  >();
  private readonly RATE_LIMIT_REQUESTS = 3;
  private readonly RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto

  constructor(private passwordResetService: PasswordResetService) {}

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Req() req: Request,
  ) {
    const clientIp = this.getClientIp(req);

    // Rate limiting
    if (!this.checkRateLimit(clientIp)) {
      throw new HttpException(
        'Demasiadas solicitudes. Intenta de nuevo en unos minutos.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const userAgent = req.get('User-Agent');

    try {
      await this.passwordResetService.requestReset(
        forgotPasswordDto.email,
        clientIp,
        userAgent,
      );
    } catch (error) {
      this.logger.error(`Error en forgot-password: ${error.message}`);
    }

    return {
      message: 'Si el correo existe, te hemos enviado un código.',
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const success = await this.passwordResetService.resetPassword(
        resetPasswordDto.email,
        resetPasswordDto.code,
        resetPasswordDto.newPassword,
      );

      if (!success) {
        throw new HttpException(
          'Código inválido o caducado.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        message: 'Contraseña actualizada correctamente.',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error en reset-password: ${error.message}`);
      throw new HttpException(
        'Código inválido o caducado.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }

  private checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = this.rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
      this.rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + this.RATE_LIMIT_WINDOW_MS,
      });
      return true;
    }

    if (record.count >= this.RATE_LIMIT_REQUESTS) {
      return false;
    }

    record.count += 1;
    return true;
  }
}
