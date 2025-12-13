#!/usr/bin/env tsx

/**
 * Reset Rate Limit Utility for Test Users
 *
 * This script allows you to reset rate limits for test users in your local environment.
 *
 * Usage:
 *   pnpm tsx scripts/reset-rate-limit.ts <user>
 *
 * Examples:
 *   # Reset all rate limits for free tier test user
 *   pnpm tsx scripts/reset-rate-limit.ts free
 *
 *   # Reset all rate limits for pro tier test user
 *   pnpm tsx scripts/reset-rate-limit.ts pro
 *
 *   # Reset all rate limits for ultra tier test user
 *   pnpm tsx scripts/reset-rate-limit.ts ultra
 *
 *   # Reset all test users at once
 *   pnpm tsx scripts/reset-rate-limit.ts --all
 */

import { config } from "dotenv";
import { resolve } from "path";
import { Redis } from "@upstash/redis";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

type TestUser = "free" | "pro" | "ultra";

const TEST_USERS: Record<TestUser, { email: string; tier: string; userId: string }> = {
  free: { email: "free@hackerai.com", tier: "free", userId: "test-user-free" },
  pro: { email: "pro@hackerai.com", tier: "pro", userId: "test-user-pro" },
  ultra: { email: "ultra@hackerai.com", tier: "ultra", userId: "test-user-ultra" },
};

async function resetRateLimitForUser(
  user: TestUser,
  userEmail: string,
): Promise<void> {
  if (!REDIS_URL || !REDIS_TOKEN) {
    console.error("❌ Error: Redis is not configured in .env.local");
    console.log(
      "\nTo configure Redis, add the following to your .env.local file:",
    );
    console.log("  UPSTASH_REDIS_REST_URL=https://your-endpoint.upstash.io");
    console.log("  UPSTASH_REDIS_REST_TOKEN=your_token_here");
    process.exit(1);
  }

  const userId = TEST_USERS[user].userId;
  console.log(`\n🔍 Using mock user ID: ${userId} for ${userEmail}`);

  const redis = new Redis({
    url: REDIS_URL,
    token: REDIS_TOKEN,
  });

  console.log(`\n🔄 Resetting all rate limits for ${user} tier user...\n`);

  try {
    // Get all keys for this user using pattern matching
    const pattern = `*${userId}*`;
    const allKeys = await redis.keys(pattern);

    if (!allKeys || allKeys.length === 0) {
      console.log(`ℹ️  No rate limit keys found for ${userEmail}`);
      return;
    }

    console.log(`📊 Found ${allKeys.length} rate limit key(s) to delete\n`);

    // Delete all matching keys
    for (const key of allKeys) {
      await redis.del(key);
      console.log(`✅ Deleted: ${key}`);
    }

    console.log(`\n✨ All rate limits reset for ${user} tier user!`);
  } catch (error) {
    console.error("\n❌ Error resetting rate limits:", error);
    process.exit(1);
  }
}

async function resetAllTestUsers(): Promise<void> {
  console.log("\n🔄 Resetting rate limits for all test users...\n");

  for (const [user, { email }] of Object.entries(TEST_USERS)) {
    await resetRateLimitForUser(user as TestUser, email);
    console.log();
  }

  console.log("✨ All test user rate limits have been reset!\n");
}

// Main CLI handler
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(`
Reset Rate Limit Utility for Test Users

Usage:
  pnpm rate-limit:reset <user>
  pnpm rate-limit:reset --all

Arguments:
  user           Test user tier: free | pro | ultra

Options:
  --all          Reset rate limits for all test users
  --help, -h     Show this help message

Examples:
  # Reset rate limits for free tier test user
  pnpm rate-limit:reset free

  # Reset rate limits for pro tier test user
  pnpm rate-limit:reset pro

  # Reset rate limits for ultra tier test user
  pnpm rate-limit:reset ultra

  # Reset all test users at once
  pnpm rate-limit:reset --all

Test Users:
  free   -> free@hackerai.com
  pro    -> pro@hackerai.com
  ultra  -> ultra@hackerai.com
`);
    process.exit(0);
  }

  // Handle --all flag
  if (args[0] === "--all") {
    await resetAllTestUsers();
    return;
  }

  // Parse user argument
  const user = args[0] as TestUser;

  // Validate user
  if (!TEST_USERS[user]) {
    console.error(
      `❌ Error: Invalid user "${user}". Must be: free | pro | ultra`,
    );
    console.log("\n💡 Tip: Use --help to see available options");
    process.exit(1);
  }

  const { email } = TEST_USERS[user];
  await resetRateLimitForUser(user, email);
}

main().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
