import { NextRequest, NextResponse } from "next/server";

// Mock MFA enroll route for development

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "MFA features are not available in development mode" },
    { status: 501 }
  );
}
