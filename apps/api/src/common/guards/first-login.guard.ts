import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FirstLoginGuard implements CanActivate {
  constructor(private prisma: PrismaClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user;

    if (!userId) {
      return true;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.isFirstLogin) {
      throw new ForbiddenException(
        'Você deve alterar sua senha no primeiro acesso. Use POST /auth/change-password',
      );
    }

    return true;
  }
}
