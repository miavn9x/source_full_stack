import { NextResponse } from "next/server";
import { env } from "@/shared/config/env";
import { getSession } from "@/shared/lib/auth";

export async function GET(request: Request): Promise<NextResponse> {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (!env.PREVIEW_SECRET) {
    return NextResponse.json(
      { error: "PREVIEW_SECRET is not configured" },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "/";
  const previewUrl = new URL("/api/preview", request.url);
  previewUrl.searchParams.set("secret", env.PREVIEW_SECRET);
  previewUrl.searchParams.set("slug", slug.startsWith("/") ? slug : `/${slug}`);

  return NextResponse.redirect(previewUrl);
}
