import { defineConfig, devices } from '@playwright/test';

const UX_VIEWPORTS = [
  { name: 'mobile', device: devices['Pixel 5'] },
  { name: 'tablet', device: devices['iPad (gen 7)'] },
  { name: 'desktop', device: devices['Desktop Chrome'] },
] as const;

/**
 * Tests UX PimentCSS v1 sur mobile, tablette et desktop.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  globalTimeout: 600_000,
  /* Preview statique en CI ; auto-fix limite la concurrence */
  workers: process.env.PLAYWRIGHT_AUTO_FIX === '0' ? undefined : process.env.CI ? 1 : 2,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['./tests/reporters/auto-fix-reporter.ts'],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  /* Site Astro docs-site (port 5173) */
  projects: [
    ...UX_VIEWPORTS.map(({ name, device }) => ({
      name,
      testMatch: /ux\/.*\.spec\.ts/,
      use: { ...device },
    })),
    {
      name: 'a11y',
      testMatch: /a11y\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: process.env.CI ? 'npm run docs:preview' : 'npm run docs',
    url: 'http://localhost:5173/',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
