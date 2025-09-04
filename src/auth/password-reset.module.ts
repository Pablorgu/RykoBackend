import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../user/user.entity';
import { PasswordResetService } from './password-reset.service';
import { EmailService } from './email.service';
import { PasswordResetController } from './password-reset.controller';
import { PasswordReset } from './password-reset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordReset, User]), ConfigModule],
  controllers: [PasswordResetController],
  providers: [PasswordResetService, EmailService],
  exports: [PasswordResetService, EmailService],
})
export class PasswordResetModule {}
