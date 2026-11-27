export const PERMISSIONS = {
  PAGE_READ: "page:read",
  PAGE_CREATE: "page:create",
  PAGE_UPDATE: "page:update",
  PAGE_PUBLISH: "page:publish",
  PAGE_DELETE: "page:delete",
  MEDIA_READ: "media:read",
  MEDIA_UPLOAD: "media:upload",
  MEDIA_DELETE: "media:delete",
  USER_READ: "user:read",
  USER_MANAGE: "user:manage",
  ROLE_MANAGE: "role:manage",
  AUDIT_READ: "audit:read",
  SETTING_MANAGE: "setting:manage",
} as const;

export type PermissionKey =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
