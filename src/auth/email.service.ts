import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: parseInt(this.configService.get('SMTP_PORT') ?? '587'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    const subject = `Tu código de recuperación Ryko: ${code}`;
    const textContent = `Tu código es ${code}. Caduca en 15 minutos. Si no lo solicitaste, ignora este correo.`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Recuperación de Contraseña - Ryko</h2>
        <p>Tu código de recuperación es:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${code}</span>
        </div>
        <p><strong>Este código caduca en 15 minutos.</strong></p>
        <p>Si no solicitaste este código, puedes ignorar este correo de forma segura.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">Equipo de Seguridad de Ryko</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM'),
        to: email,
        subject,
        text: textContent,
        html: htmlContent,
      });

      this.logger.log(
        `Código de recuperación enviado a: ${email.substring(0, 3)}***`,
      );
    } catch (error) {
      this.logger.error(
        `Error enviando email a ${email.substring(0, 3)}***: ${error.message}`,
      );
      throw error;
    }
  }
}
