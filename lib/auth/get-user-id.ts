import type { NextRequest } from "next/server";
import { ChatSDKError } from "@/lib/errors";
import type { SubscriptionTier } from "@/types";

// Mock user for development - no authentication required
const MOCK_USER_ID = "dev-user-001";
const MOCK_SUBSCRIPTION: SubscriptionTier = "pro"; // Give dev user pro access

/**
 * Get the current user ID from the authenticated session
 * Development mode: Returns mock user ID
 */
export const getUserID = async (req: NextRequest): Promise<string> => {
  return MOCK_USER_ID;
};

/**
 * Get the current user ID and pro status from the authenticated session
 * Development mode: Returns mock user with pro subscription
 */
export const getUserIDAndPro = async (
  req: NextRequest,
): Promise<{
  userId: string;
  subscription: SubscriptionTier;
}> => {
  return { userId: MOCK_USER_ID, subscription: MOCK_SUBSCRIPTION };
};

/**
 * Get the current user ID only if the user has signed in recently.
 * Development mode: Always returns mock user ID
 */
export const getUserIDWithFreshLogin = async (
  req: NextRequest,
  windowMs: number = 10 * 60 * 1000,
): Promise<string> => {
  return MOCK_USER_ID;
};
