import { NextResponse } from "next/server";

// Mock signup route - redirects to home since auth is disabled
export async function GET(request: Request) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Simply redirect to home - user is always logged in via mock auth
  return NextResponse.redirect(new URL("/", baseUrl));
}
