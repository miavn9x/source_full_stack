export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  roles: string[];
  permissions: string[];
}

export interface JwtAccessPayload {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
  type: 'access';
}

export interface JwtRefreshPayload {
  sub: string;
  type: 'refresh';
}
