import { NextResponse } from "next/server";
import {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
  nestMe,
  nestRefresh,
  NestAuthError,
} from "@/shared/lib/auth";

export async function GET(): Promise<NextResponse> {
  const accessToken = await getAccessToken();

  if (accessToken) {
    try {
      const user = await nestMe(accessToken);
      return NextResponse.json({ user });
    } catch (error) {
      if (!(error instanceof NestAuthError) || error.status !== 401) {
        return NextResponse.json(
          { error: "Session check failed" },
          { status: 502 },
        );
      }
    }
  }

  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const result = await nestRefresh(refreshToken);
    await setAuthCookies(result.accessToken, result.refreshToken);
    return NextResponse.json({ user: result.user });
  } catch {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
}
