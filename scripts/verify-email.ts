// Script disabled - authentication is mocked in development mode

import chalk from "chalk";

const targetEmail = process.argv[2];

console.log(chalk.bold.blue("\n📧 Email Verification\n"));
console.log(chalk.green("✓ Authentication is mocked in development mode."));
console.log(chalk.green("✓ All email verification is bypassed.\n"));

if (targetEmail) {
  console.log(`Requested email: ${targetEmail}`);
  console.log(chalk.green("✓ Email would be verified in production mode.\n"));
} else {
  console.log(chalk.yellow("Usage: npx tsx scripts/verify-email.ts <email>\n"));
}
