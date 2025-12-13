# Development Scripts

This directory contains utility scripts for local development and testing.

## Authentication

Authentication is mocked in development mode. All test users are automatically available without needing to create or verify them.

## Rate Limit Management

### Reset Rate Limits

Use the `reset-rate-limit.ts` script to clear rate limit counters for users during local development.

#### Quick Start

```bash
# Reset all rate limits for free tier user
pnpm rate-limit:reset free

# Reset all rate limits for pro tier user
pnpm rate-limit:reset pro

# Reset all test users
pnpm rate-limit:reset --all
```

#### Usage

```bash
pnpm rate-limit:reset <user>
```

**Arguments:**

- `user` - Test user tier: `free` | `pro` | `ultra`

**Options:**

- `--all` - Reset rate limits for all test users
- `--help` - Show help message

#### Configuration

The script requires Upstash Redis to be configured in `.env.local`:

```env
UPSTASH_REDIS_REST_URL=https://your-endpoint.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

If Redis is not configured, rate limiting is automatically disabled in local development.

#### Rate Limit Settings

Default rate limits per 5-hour window:

**Ask Mode:**

- Free: 10 requests
- Pro: 80 requests
- Ultra: 240 requests
- Team: 160 requests

**Agent Mode:**

- Pro: 45 requests
- Ultra: 135 requests
- Team: 90 requests

Configure in `.env.local`:

```env
FREE_RATE_LIMIT_REQUESTS=10
PRO_RATE_LIMIT_REQUESTS=80
ULTRA_RATE_LIMIT_REQUESTS=240
TEAM_RATE_LIMIT_REQUESTS=160
AGENT_MODE_RATE_LIMIT_REQUESTS=45
ULTRA_AGENT_MODE_RATE_LIMIT_REQUESTS=135
TEAM_AGENT_MODE_RATE_LIMIT_REQUESTS=90
```

## Test Users

Test users are mocked and automatically available:

- `free@hackerai.com` (free tier)
- `pro@hackerai.com` (pro tier)
- `ultra@hackerai.com` (ultra tier)

```bash
# View test user info (no action needed)
pnpm test:e2e:users:create
```

## Other Scripts

### E2B Sandbox Management

```bash
# Build development E2B sandbox
pnpm e2b:build:dev

# Build production E2B sandbox
pnpm e2b:build:prod
```

### S3 Security Validation

```bash
# Validate S3 security configuration
pnpm s3:validate
```
