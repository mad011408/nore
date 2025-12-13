import { NextRequest, NextResponse } from "next/server";

// Mock MFA verify route for development
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "MFA features are not available in development mode" },
    { status: 501 }
  );
}
