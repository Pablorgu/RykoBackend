import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { EmailService } from './email.service';
import { PasswordReset } from './password-reset.entity';

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);
  private readonly EXPIRATION_TIME_MS = 15 * 60 * 1000; // 15 minutes
  private readonly MAX_ATTEMPTS = 5;

  constructor(
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async requestReset(
    email: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAtMs = (Date.now() + this.EXPIRATION_TIME_MS).toString();

    // Find user (may not exist)
    const user = await this.userRepository.findOne({ where: { email } });

    // Always create record (even if user doesn't exist)
    const passwordReset = this.passwordResetRepository.create({
      user,
      email,
      codeHash,
      expiresAtMs,
      attempts: 0,
      used: false,
      ipAddress,
      userAgent,
    });

    await this.passwordResetRepository.save(passwordReset);

    // Send email only if user exists
    if (user) {
      try {
        await this.emailService.sendPasswordResetCode(email, code);
        this.logger.log(
          `Solicitud de reset procesada para: ${email.substring(0, 3)}***`,
        );
      } catch (error) {
        this.logger.error(`Error enviando email de reset: ${error.message}`);
        // Don't fail the operation if email fails
      }
    } else {
      this.logger.log(
        `Solicitud de reset para email inexistente: ${email.substring(0, 3)}***`,
      );
    }
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<boolean> {
    // Find the latest active record for this email
    const passwordReset = await this.passwordResetRepository.findOne({
      where: {
        email,
        used: false,
        expiresAtMs: MoreThan(Date.now().toString()),
      },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    if (!passwordReset) {
      this.logger.warn(
        `Intento de reset con registro inexistente/caducado: ${email.substring(0, 3)}***`,
      );
      return false;
    }

    // Check attempts
    if (passwordReset.attempts >= this.MAX_ATTEMPTS) {
      this.logger.warn(
        `Máximo de intentos alcanzado para: ${email.substring(0, 3)}***`,
      );
      return false;
    }

    // Increment attempts
    passwordReset.attempts += 1;
    await this.passwordResetRepository.save(passwordReset);

    // Verify code
    const isValidCode = await bcrypt.compare(code, passwordReset.codeHash);
    if (!isValidCode) {
      this.logger.warn(`Código inválido para: ${email.substring(0, 3)}***`);
      return false;
    }

    // Verify that user exists
    if (!passwordReset.user) {
      this.logger.warn(
        `Usuario no encontrado para reset: ${email.substring(0, 3)}***`,
      );
      return false;
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(
      { id: passwordReset.user.id },
      { password: hashedPassword },
    );

    // Mark as used
    passwordReset.used = true;
    await this.passwordResetRepository.save(passwordReset);

    // Invalidar otros registros activos del mismo email
    await this.passwordResetRepository.update(
      {
        email,
        used: false,
        id: passwordReset.id, // Exclude current one
      },
      { used: true },
    );

    this.logger.log(
      `Contraseña actualizada exitosamente para: ${email.substring(0, 3)}***`,
    );
    return true;
  }
}
