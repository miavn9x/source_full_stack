import { NextResponse } from "next/server";

export async function proxy(): Promise<NextResponse> {
  // Direct access to Admin CRM portal without login requirements
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
