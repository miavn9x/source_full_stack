import { env } from "@/shared/config/env";
import type { SessionUser } from "./constants";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}

export class NestAuthError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "NestAuthError";
  }
}

async function parseError(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as
    | { message?: unknown }
    | null;

  if (typeof body?.message === "string") return body.message;
  if (Array.isArray(body?.message)) return body.message.join(", ");
  return `Authentication request failed (${response.status})`;
}

export async function nestLogin(
  email: string,
  password: string,
): Promise<AuthTokens> {
  const response = await fetch(`${env.NEST_API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new NestAuthError(await parseError(response), response.status);
  }

  return (await response.json()) as AuthTokens;
}

export async function nestRefresh(refreshToken: string): Promise<AuthTokens> {
  const response = await fetch(`${env.NEST_API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new NestAuthError(await parseError(response), response.status);
  }

  return (await response.json()) as AuthTokens;
}

export async function nestMe(accessToken: string): Promise<SessionUser> {
  const response = await fetch(`${env.NEST_API_URL}/api/v1/auth/me`, {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new NestAuthError(await parseError(response), response.status);
  }

  return (await response.json()) as SessionUser;
}

export async function nestLogout(
  accessToken: string | undefined,
  refreshToken: string | undefined,
): Promise<void> {
  if (!accessToken && !refreshToken) return;

  await fetch(`${env.NEST_API_URL}/api/v1/auth/logout`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  }).catch(() => undefined);
}
