import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service.js';
import type {
  IdentityRepository,
  IdentityUser,
  RefreshTokenRecord,
} from '../domain/identity.repository.js';

const userInclude = {
  roles: {
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  },
} as const;

type UserWithAccess = {
  id: string;
  email: string;
  passwordHash: string;
  name: string | null;
  status: 'ACTIVE' | 'DISABLED';
  roles: Array<{
    role: {
      name: string;
      permissions: Array<{ permission: { key: string } }>;
    };
  }>;
};

function toIdentityUser(user: UserWithAccess): IdentityUser {
  return {
    id: user.id,
    email: user.email,
    passwordHash: user.passwordHash,
    name: user.name,
    status: user.status,
    roles: user.roles.map((entry) => entry.role.name),
    permissions: [
      ...new Set(
        user.roles.flatMap((entry) =>
          entry.role.permissions.map((rp) => rp.permission.key),
        ),
      ),
    ],
  };
}

@Injectable()
export class PrismaIdentityRepository implements IdentityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<IdentityUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: userInclude,
    });

    return user ? toIdentityUser(user) : null;
  }

  async findById(id: string): Promise<IdentityUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: userInclude,
    });

    return user ? toIdentityUser(user) : null;
  }

  async createRefreshToken(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.prisma.refreshToken.create({ data: input });
  }

  async findRefreshToken(
    tokenHash: string,
  ): Promise<RefreshTokenRecord | null> {
    return this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        tokenHash: true,
        expiresAt: true,
        revokedAt: true,
      },
    });
  }

  async revokeRefreshToken(tokenHash: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
