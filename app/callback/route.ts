import { NextRequest, NextResponse } from "next/server";

// Mock callback route - redirects to home since auth is disabled
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Simply redirect to home
  return NextResponse.redirect(new URL("/", baseUrl));
}
