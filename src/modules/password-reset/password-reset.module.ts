import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetController } from './password-reset.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [PasswordResetService, PrismaClient],
  controllers: [PasswordResetController],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
