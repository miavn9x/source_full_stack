import "server-only";

import { cookies } from "next/headers";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
} from "./constants";

const isProduction = process.env.NODE_ENV === "production";

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  const store = await cookies();
  const common = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
  };

  store.set(ACCESS_COOKIE, accessToken, common);
  store.set(REFRESH_COOKIE, refreshToken, {
    ...common,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}
