import { defineConfig } from '@playwright/test';

// Explicit opt-in: real persistence and ONE notification to the configured owner.
process.loadEnvFile('.env');

export default defineConfig({
  testDir: './tests/services',
  testMatch: 'contactLive.spec.ts',
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 90000,
  reporter: 'list',
});
