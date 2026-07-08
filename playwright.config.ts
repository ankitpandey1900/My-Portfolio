import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3005',
    trace: 'on-first-retry',
  },
  webServer: {
    command: process.env.CI ? 'node .next/standalone/server.js' : 'npm run start',
    url: 'http://127.0.0.1:3005',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      PORT: '3005',
      NEXT_PUBLIC_APP_URL: 'http://127.0.0.1:3005',
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'dummy',
      SUPABASE_SERVICE_ROLE_KEY: 'dummy',
      RESEND_API_KEY: 'dummy',
      NOTIFICATION_EMAIL_RECIPIENT: 'test@example.com',
      GITHUB_PERSONAL_ACCESS_TOKEN: 'dummy',
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
