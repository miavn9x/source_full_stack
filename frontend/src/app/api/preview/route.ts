import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/shared/config/env";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (!env.PREVIEW_SECRET || secret !== env.PREVIEW_SECRET) {
    return new NextResponse("Invalid preview secret", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  const slug = url.searchParams.get("slug") ?? "/";
  return NextResponse.redirect(new URL(slug, request.url));
}
