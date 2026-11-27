import { NextResponse } from "next/server";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  nestLogout,
} from "@/shared/lib/auth";

export async function POST(): Promise<NextResponse> {
  const [accessToken, refreshToken] = await Promise.all([
    getAccessToken(),
    getRefreshToken(),
  ]);

  await nestLogout(accessToken, refreshToken);
  await clearAuthCookies();

  return NextResponse.json({ ok: true });
}
