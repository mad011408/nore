import { NextResponse } from "next/server";

// Mock logout route - redirects to home since auth is disabled
export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Simply redirect to home
  return NextResponse.redirect(new URL("/", baseUrl));
};
