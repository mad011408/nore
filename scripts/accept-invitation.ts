// Script disabled - authentication is mocked in development mode

import chalk from "chalk";

const targetEmail = process.argv[2] || "test@hackerai.com";

console.log(chalk.bold.blue("\n🎫 Accept Invitation\n"));
console.log(chalk.green("✓ Authentication is mocked in development mode."));
console.log(chalk.green("✓ Invitation acceptance is not required.\n"));

if (targetEmail) {
  console.log(`Requested email: ${targetEmail}`);
  console.log(chalk.green("✓ Invitation would be accepted in production mode.\n"));
} else {
  console.log(chalk.yellow("Usage: npx tsx scripts/accept-invitation.ts <email>\n"));
}
