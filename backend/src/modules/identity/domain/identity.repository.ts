export const IDENTITY_REPOSITORY = Symbol('IDENTITY_REPOSITORY');

export interface IdentityUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string | null;
  status: 'ACTIVE' | 'DISABLED';
  roles: string[];
  permissions: string[];
}

export interface RefreshTokenRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface IdentityRepository {
  findByEmail(email: string): Promise<IdentityUser | null>;
  findById(id: string): Promise<IdentityUser | null>;
  createRefreshToken(input: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;
  findRefreshToken(tokenHash: string): Promise<RefreshTokenRecord | null>;
  revokeRefreshToken(tokenHash: string): Promise<void>;
}
