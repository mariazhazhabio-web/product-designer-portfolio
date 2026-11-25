import { defineConfig, devices } from "@playwright/test";

// Uses the locally installed Google Chrome by default (no browser download needed).
// To use Playwright's bundled Chromium instead: `npx playwright install chromium` and set PW_CHANNEL=chromium.
const channel = process.env.PW_CHANNEL ?? "chrome";
const PORT = 3200;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure", acceptDownloads: true },
  webServer: { command: `node scripts/serve-out.mjs ${PORT}`, port: PORT, reuseExistingServer: !process.env.CI },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: channel === "chromium" ? undefined : channel, viewport: { width: 1440, height: 900 } }, testIgnore: /mobile.spec.ts/ },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: channel === "chromium" ? undefined : channel }, testMatch: /mobile\.spec\.ts/ },
  ],
});
