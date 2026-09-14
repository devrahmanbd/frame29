import { defineConfig, devices } from "@playwright/test";

/**
 * Release gate suite. Runs against the already-running dev server by default
 * (CI boots a production build on the same port first), so the specs never
 * depend on a seeded staff session: every loop asserts what an anonymous
 * visitor — or a bot — can see and do.
 */
const baseURL = process.env["E2E_BASE_URL"] ?? "http://localhost:8080";

export default defineConfig({
  testDir: "./specs",
  outputDir: "../.artifacts/e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  retries: process.env["CI"] ? 2 : 1,
  workers: process.env["CI"] ? 2 : 4,
  fullyParallel: true,
  reporter: process.env["CI"] ? [["list"], ["html", { open: "never", outputFolder: "../.artifacts/e2e-report" }]] : [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop@chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 1800 } },
    },
    {
      name: "android-mid@chromium",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "bun run dev",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
