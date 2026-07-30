import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { z } from 'zod';

const LoginDto = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const ChangePasswordDto = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8, 'Nova senha deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

const RefreshTokenDto = z.object({
  refreshToken: z.string(),
});

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: unknown) {
    const { email, password } = LoginDto.parse(body);
    return this.authService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(
    @CurrentUser() userId: string,
    @Body() body: unknown,
    @Res() res: Response,
  ) {
    const { refreshToken } = RefreshTokenDto.parse(body);
    await this.authService.logout(userId, refreshToken);
    res.status(204).send();
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: unknown) {
    const { refreshToken } = RefreshTokenDto.parse(body);
    const payload = this.decodeToken(refreshToken);
    return this.authService.refreshToken(payload.sub, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(200)
  async changePassword(
    @CurrentUser() userId: string,
    @Body() body: unknown,
  ) {
    const { currentPassword, newPassword } = ChangePasswordDto.parse(body);
    return this.authService.changePassword(userId, currentPassword, newPassword);
  }

  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid token');
      const decoded = JSON.parse(
        Buffer.from(parts[1], 'base64').toString('utf-8'),
      );
      return decoded;
    } catch {
      throw new BadRequestException('Token inválido');
    }
  }
}
