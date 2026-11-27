export const ACCESS_COOKIE = "admin_access";
export const REFRESH_COOKIE = "admin_refresh";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  roles: string[];
  permissions: string[];
}

export function hasPermission(
  user: SessionUser | null | undefined,
  permission: string,
): boolean {
  return Boolean(user?.permissions.includes(permission));
}
