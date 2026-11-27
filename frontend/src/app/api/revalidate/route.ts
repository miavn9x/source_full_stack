import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { env } from "@/shared/config/env";

interface RevalidateBody {
  tags?: string[];
  paths?: string[];
  tag?: string;
}

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");

  if (!env.REVALIDATE_SECRET || secret !== env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RevalidateBody | null;

  if (!body) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const tags = [...(body.tags ?? []), ...(body.tag ? [body.tag] : [])];
  const paths = body.paths ?? [];

  if (tags.length === 0 && paths.length === 0) {
    return NextResponse.json(
      { error: "tags or paths is required" },
      { status: 400 },
    );
  }

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ ok: true, tags, paths });
}
