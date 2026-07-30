import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatch = await argon2.verify(user.passwordHash, password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Usuário inativo');
    }

    const tokens = await this.generateTokens(user.id);
    await this.createSession(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isFirstLogin: user.isFirstLogin,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(userId: string, refreshToken: string) {
    await this.prisma.userSession.updateMany({
      where: { userId, refreshTokenHash: await argon2.hash(refreshToken) },
      data: { revokedAt: new Date() },
    });
  }

  async refreshToken(userId: string, refreshToken: string) {
    const session = await this.prisma.userSession.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      throw new UnauthorizedException('Sessão inválida ou expirada');
    }

    const tokenMatch = await argon2.verify(session.refreshTokenHash, refreshToken);
    if (!tokenMatch) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const tokens = await this.generateTokens(userId);
    await this.prisma.userSession.update({
      where: { id: session.id },
      data: { refreshTokenHash: await argon2.hash(tokens.refreshToken) },
    });

    return tokens;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const passwordMatch = await argon2.verify(user.passwordHash, currentPassword);
    if (!passwordMatch) {
      throw new BadRequestException('Senha atual incorreta');
    }

    const hashedPassword = await argon2.hash(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: hashedPassword,
        isFirstLogin: false,
      },
    });

    return { message: 'Senha alterada com sucesso' };
  }

  private async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  private async createSession(userId: string, refreshToken: string) {
    const hashedToken = await argon2.hash(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.userSession.create({
      data: {
        userId,
        refreshTokenHash: hashedToken,
        expiresAt,
      },
    });
  }
}
