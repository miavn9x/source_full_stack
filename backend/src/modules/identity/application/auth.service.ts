import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import { createHash } from 'node:crypto';
import * as argon2 from 'argon2';
import { env } from '../../../config/env.js';
import type { AuthUser } from '../../../common/auth/auth-user.js';
import { AuditService } from '../../audit/audit.service.js';
import {
  IDENTITY_REPOSITORY,
  type IdentityRepository,
  type IdentityUser,
} from '../domain/identity.repository.js';
import type {
  LoginDto,
  LogoutDto,
  RefreshTokenDto,
} from '../presentation/dto/auth.dto.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly repository: IdentityRepository,
    private readonly jwtService: JwtService,
    private readonly audit: AuditService,
  ) {}

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.repository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('User is disabled');
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.issueTokens(user);
    await this.audit.record({
      actorId: user.id,
      action: 'auth.login',
      entityType: 'user',
      entityId: user.id,
    });

    return tokens;
  }

  async refresh(dto: RefreshTokenDto): Promise<AuthTokens> {
    let payload: { sub?: string; type?: string };

    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh' || !payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenHash = hashToken(dto.refreshToken);
    const stored = await this.repository.findRefreshToken(tokenHash);

    if (
      !stored ||
      stored.revokedAt ||
      stored.expiresAt.getTime() <= Date.now() ||
      stored.userId !== payload.sub
    ) {
      throw new UnauthorizedException('Refresh token is no longer valid');
    }

    const user = await this.repository.findById(payload.sub);
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User is not available');
    }

    await this.repository.revokeRefreshToken(tokenHash);
    return this.issueTokens(user);
  }

  async logout(dto: LogoutDto): Promise<{ ok: true }> {
    if (dto.refreshToken) {
      await this.repository.revokeRefreshToken(hashToken(dto.refreshToken));
    }

    return { ok: true };
  }

  async me(userId: string): Promise<AuthUser> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.toAuthUser(user);
  }

  private async issueTokens(user: IdentityUser): Promise<AuthTokens> {
    const accessPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
      type: 'access' as const,
    };

    const refreshPayload = {
      sub: user.id,
      type: 'refresh' as const,
    };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: env.JWT_ACCESS_SECRET,
      expiresIn: env.JWT_ACCESS_TTL as JwtSignOptions['expiresIn'],
    });

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: env.JWT_REFRESH_SECRET,
      expiresIn: env.JWT_REFRESH_TTL as JwtSignOptions['expiresIn'],
    });

    const decoded = this.jwtService.decode(refreshToken) as {
      exp?: number;
    } | null;

    const expiresAt = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.repository.createRefreshToken({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: this.toAuthUser(user),
    };
  }

  private toAuthUser(user: IdentityUser): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
      permissions: user.permissions,
    };
  }
}
