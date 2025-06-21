import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",  // Directory where tests are located
  fullyParallel: true,  // Run tests in parallel
  forbidOnly: !!process.env.CI,  // Disallow ".only" on tests in CI to prevent accidental skipping
  retries: process.env.CI ? 1 : 0,  // Retry failed tests only in CI (2 retries), none locally
  workers: process.env.CI ? 1 : undefined,  // Limit to 1 worker in CI (to avoid overloading the system), undefined for local

  timeout: process.env.TEST_TIMEOUT ? Number(process.env.TEST_TIMEOUT) : 120000, // Global test timeout (default: 120 seconds)

  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never"  }],  // Generate an HTML report for test results
  ],

  use: {
    headless: process.env.CI ? true : process.env.HEADLESS !== "false", // Always run in headless mode on CI, else based on HEADLESS environment variable
    trace: process.env.CI ? "on-first-retry" : "off",  // Enable trace for failed retries in CI, disable otherwise
    video: process.env.RECORD_VIDEO === "true" ? "on" : "retain-on-failure",  // Record videos if enabled, or only on failure
    screenshot: "only-on-failure",  // Capture screenshot only when a test fails
    ignoreHTTPSErrors: true,  // Ignore HTTPS errors during tests

    // Customizable timeouts through environment variables or default values
    actionTimeout: process.env.ACTION_TIMEOUT ? Number(process.env.ACTION_TIMEOUT) : 5000,  // Timeout for individual actions (default: 5 seconds)
    navigationTimeout: process.env.NAVIGATION_TIMEOUT ? Number(process.env.NAVIGATION_TIMEOUT) : 10000,  // Timeout for page navigation (default: 10 seconds)
  },

  projects: [
    {
      name: "chromium",  // Project for testing with Chromium browser
      use: { ...devices["Desktop Chrome"] },  // Use Desktop Chrome device profile for testing
    },
  ],
});
