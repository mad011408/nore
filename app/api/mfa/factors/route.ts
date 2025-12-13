import { NextRequest, NextResponse } from "next/server";

// Mock MFA factors route for development
export async function GET(req: NextRequest) {
  // Return empty factors list for development
  return NextResponse.json({ factors: [] });
}
