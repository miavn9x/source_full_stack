import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../../common/auth/auth.guard.js';
import { PermissionsGuard } from '../../common/auth/permissions.guard.js';
import { AuditModule } from '../audit/audit.module.js';
import { AuthService } from './application/auth.service.js';
import { IDENTITY_REPOSITORY } from './domain/identity.repository.js';
import { PrismaIdentityRepository } from './infrastructure/prisma-identity.repository.js';
import { AuthController } from './presentation/auth.controller.js';

@Module({
  imports: [JwtModule.register({}), AuditModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: IDENTITY_REPOSITORY,
      useClass: PrismaIdentityRepository,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class IdentityModule {}
