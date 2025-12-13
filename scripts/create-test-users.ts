// Script disabled - authentication is mocked in development mode
// Test users are automatically available when using mock auth

import chalk from "chalk";

interface TestUser {
  email: string;
  password: string;
  tier: "free" | "pro" | "ultra";
}

const TEST_USERS: TestUser[] = [
  {
    email: "free@hackerai.com",
    password: "mock-password",
    tier: "free",
  },
  {
    email: "pro@hackerai.com",
    password: "mock-password",
    tier: "pro",
  },
  {
    email: "ultra@hackerai.com",
    password: "mock-password",
    tier: "ultra",
  },
];

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || "create";

async function main() {
  console.log(chalk.bold.blue("\n🔧 Test Users for E2E Tests\n"));
  console.log(chalk.green("✓ Authentication is mocked in development mode."));
  console.log(chalk.green("✓ All test users are automatically available.\n"));

  console.log("Available test users:");
  TEST_USERS.forEach((user) => {
    console.log(`  - ${user.email} (${user.tier} tier)`);
  });

  console.log(chalk.bold.blue("\n📝 Notes\n"));
  console.log("Since authentication is mocked:");
  console.log("  - No real user creation is needed");
  console.log("  - No password reset is needed");
  console.log("  - No email verification is needed");
  console.log("  - Simply run your tests directly\n");

  console.log(chalk.bold.green("✨ Ready for testing!\n"));
}

main().catch((error) => {
  console.error(chalk.red("\n❌ Error:"), error);
  process.exit(1);
});
