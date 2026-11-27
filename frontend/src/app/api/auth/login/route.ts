import { NextResponse } from "next/server";
import { z } from "zod";
import { setAuthCookies, nestLogin, NestAuthError } from "@/shared/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Email hoặc mật khẩu không hợp lệ" },
      { status: 400 },
    );
  }

  try {
    const result = await nestLogin(parsed.data.email, parsed.data.password);
    await setAuthCookies(result.accessToken, result.refreshToken);
    return NextResponse.json({ user: result.user });
  } catch (error) {
    const status = error instanceof NestAuthError ? error.status : 502;
    const message =
      error instanceof NestAuthError
        ? error.message
        : "Không kết nối được API đăng nhập";
    return NextResponse.json({ error: message }, { status });
  }
}
