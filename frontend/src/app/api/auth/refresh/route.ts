import { NextResponse } from "next/server";
import {
  getRefreshToken,
  setAuthCookies,
  nestRefresh,
  NestAuthError,
} from "@/shared/lib/auth";

export async function POST(): Promise<NextResponse> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const result = await nestRefresh(refreshToken);
    await setAuthCookies(result.accessToken, result.refreshToken);
    return NextResponse.json({ user: result.user });
  } catch (error) {
    const status = error instanceof NestAuthError ? error.status : 502;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Refresh failed" },
      { status },
    );
  }
}
