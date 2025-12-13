import { NextRequest, NextResponse } from "next/server";

// Mock delete account route for development
export const POST = async (req: NextRequest) => {
  // In production, you would handle actual account deletion here
  console.log("Delete account requested - mock implementation");
  return NextResponse.json({ ok: true });
};
