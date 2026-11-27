import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthUser } from './auth-user.js';
import { IS_PUBLIC_KEY } from './public.decorator.js';
import { PERMISSIONS_KEY } from './permissions.decorator.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required?.length) return true;

    const request = context
      .switchToHttp()
      .getRequest<{ user?: AuthUser }>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    const allowed = required.every((permission) =>
      user.permissions.includes(permission),
    );

    if (!allowed) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
