import { env } from "./env";

export const API_BASE_URL = env.NEST_API_URL;
export const API_V1_URL = `${API_BASE_URL}/api/v1`;

export const API_ENDPOINTS = {
  auth: {
    login: `${API_V1_URL}/auth/login`,
    logout: `${API_V1_URL}/auth/logout`,
    refresh: `${API_V1_URL}/auth/refresh`,
    me: `${API_V1_URL}/auth/me`,
  },
  admin: {
    pages: `${API_V1_URL}/admin/pages`,
    media: `${API_V1_URL}/admin/media`,
    users: `${API_V1_URL}/admin/users`,
    audit: `${API_V1_URL}/admin/audit`,
  },
  public: {
    pages: `${API_V1_URL}/public/pages`,
  },
} as const;
