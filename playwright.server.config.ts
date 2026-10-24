import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/server',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: 'list',
});
