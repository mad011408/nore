import { Page, BrowserContext } from "@playwright/test";
import { TIMEOUTS } from "../constants";

export interface TestUser {
  email: string;
  password: string;
  tier: "free" | "pro" | "ultra";
}

export const TEST_USERS: Record<"free" | "pro" | "ultra", TestUser> = {
  free: {
    email: "free@hackerai.com",
    password: "mock-password",
    tier: "free",
  },
  pro: {
    email: "pro@hackerai.com",
    password: "mock-password",
    tier: "pro",
  },
  ultra: {
    email: "ultra@hackerai.com",
    password: "mock-password",
    tier: "ultra",
  },
};

export interface AuthOptions {
  skipCache?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

// Mock authentication - no real auth needed
export async function authenticateUser(
  page: Page,
  user: TestUser,
  options: AuthOptions = {},
): Promise<void> {
  // Simply navigate to home - auth is mocked
  await page.goto("/");
  await page.waitForLoadState("networkidle");
}

export async function logout(page: Page): Promise<void> {
  // Simply navigate to home - auth is mocked
  await page.goto("/");
}

export async function clearAuthCache(): Promise<void> {
  // No-op - no cache needed
}

export async function getAuthState(context: BrowserContext): Promise<{
  isAuthenticated: boolean;
  hasCookies: boolean;
}> {
  // Always authenticated in mock mode
  return {
    isAuthenticated: true,
    hasCookies: false,
  };
}
