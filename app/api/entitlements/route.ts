import { NextRequest } from "next/server";
import { json } from "@/lib/api/response";

// Mock entitlements route for development
// Always returns pro subscription
export async function GET(req: NextRequest) {
  // Return mock entitlements for development
  const mockEntitlements = ["pro-plan"];
  const subscription = "pro";

  return json({
    entitlements: mockEntitlements,
    subscription,
  });
}
