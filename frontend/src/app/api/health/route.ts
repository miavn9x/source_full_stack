import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "fe",
    timestamp: new Date().toISOString(),
  });
}
