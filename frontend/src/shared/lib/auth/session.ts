import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/shared/config/env";
import { ACCESS_COOKIE, type SessionUser } from "./constants";

export const getSession = cache(async (): Promise<SessionUser | null> => {
  const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  try {
    const response = await fetch(`${env.NEST_API_URL}/api/v1/auth/me`, {
      headers: { authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return (await response.json()) as SessionUser;
  } catch {
    return null;
  }
});

export async function requireSession(nextPath: string): Promise<SessionUser> {
  const user = await getSession();
  if (!user) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}
