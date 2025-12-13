import { NextRequest, NextResponse } from "next/server";

// Mock logout-all route for development
export async function POST(req: NextRequest) {
  // In development mode, just return success
  return NextResponse.json({ success: true });
}
