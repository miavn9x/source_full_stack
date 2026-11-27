import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { env } from '../../config/env.js';
import type { AuthUser, JwtAccessPayload } from './auth-user.js';
import { IS_PUBLIC_KEY } from './public.decorator.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser }>();
    const header = request.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtAccessPayload>(
        header.slice('Bearer '.length),
        { secret: env.JWT_ACCESS_SECRET },
      );

      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }

      request.user = {
        id: payload.sub,
        email: payload.email,
        name: null,
        roles: payload.roles,
        permissions: payload.permissions,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
