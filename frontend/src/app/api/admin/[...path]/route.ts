import { NextResponse } from "next/server";
import { env } from "@/shared/config/env";
import {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
  nestRefresh,
} from "@/shared/lib/auth";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function buildTarget(
  request: Request,
  path: string[],
): Promise<string> {
  const encodedPath = path.map(encodeURIComponent).join("/");
  const url = new URL(request.url);
  return `${env.NEST_API_URL}/api/v1/admin/${encodedPath}${url.search}`;
}

async function forward(
  request: Request,
  path: string[],
  accessToken: string,
  body: ArrayBuffer | undefined,
): Promise<Response> {
  const target = await buildTarget(request, path);
  const method = request.method.toUpperCase();
  const headers: Record<string, string> = {
    authorization: `Bearer ${accessToken}`,
    accept: request.headers.get("accept") ?? "application/json",
  };

  const contentType = request.headers.get("content-type");
  if (contentType) headers["content-type"] = contentType;

  return fetch(target, {
    method,
    headers,
    body,
    cache: "no-store",
  });
}

async function handler(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { path } = await context.params;
  const method = request.method.toUpperCase();
  const body = ["GET", "HEAD"].includes(method)
    ? undefined
    : await request.arrayBuffer();
  let accessToken = await getAccessToken();

  if (!accessToken) {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const tokens = await nestRefresh(refreshToken);
      await setAuthCookies(tokens.accessToken, tokens.refreshToken);
      accessToken = tokens.accessToken;
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let response: Response;
  try {
    response = await forward(request, path, accessToken, body);
  } catch {
    return NextResponse.json(
      { error: "Business API is unavailable" },
      { status: 502 },
    );
  }

  if (response.status === 401) {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      try {
        const tokens = await nestRefresh(refreshToken);
        await setAuthCookies(tokens.accessToken, tokens.refreshToken);
        response = await forward(request, path, tokens.accessToken, body);
      } catch {
        // Fall through and return the original 401.
      }
    }
  }

  const responseBody = await response.arrayBuffer();
  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") ?? "application/json",
      "cache-control": "no-store",
    },
  });
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
