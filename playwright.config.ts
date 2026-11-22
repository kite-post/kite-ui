import { defineConfig, devices } from '@playwright/test'

// Візуальні регресії: кожна історія Storybook у світлій і темній темі.
// Еталони знімаються в Linux-образі Playwright (make visual-update), той самий образ —
// у CI, тож шрифти й згладжування збігаються.
export default defineConfig({
  testDir: './visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: 'disabled', caret: 'hide' },
  },
  use: {
    baseURL: 'http://127.0.0.1:6007',
    ...devices['Desktop Chrome'],
    viewport: { width: 1024, height: 720 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    locale: 'uk-UA',
    timezoneId: 'Europe/Kyiv',
  },
  webServer: {
    command: 'node visual/serve.ts',
    url: 'http://127.0.0.1:6007/index.json',
    reuseExistingServer: !process.env.CI,
  },
})
