import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { z } from 'zod';

const RequestResetDto = z.object({
  email: z.string().email('Email inválido'),
});

const ResetPasswordDto = z.object({
  token: z.string(),
  newPassword: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

@UseGuards(ThrottlerGuard)
@Controller('password-reset')
export class PasswordResetController {
  constructor(private passwordResetService: PasswordResetService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('request')
  @HttpCode(200)
  async requestReset(@Body() body: unknown) {
    const { email } = RequestResetDto.parse(body);
    return this.passwordResetService.requestReset(email);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('confirm')
  @HttpCode(200)
  async confirmReset(@Body() body: unknown) {
    const { token, newPassword } = ResetPasswordDto.parse(body);
    return this.passwordResetService.resetPassword(token, newPassword);
  }
}
