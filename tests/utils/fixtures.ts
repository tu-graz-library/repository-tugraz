// -*- coding: utf-8 -*-
//
// Copyright (C) 2025 Graz University of Technology.
//
// repository-tugraz is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.


import { test as base, expect, Page, BrowserContext } from "@playwright/test";
import { mkdirSync } from "fs";
import { join } from "path";

const screenshotDir = "./screenshots";
mkdirSync(screenshotDir, { recursive: true }); // Ensure the directory exists

export const test = base.extend<{
  context: BrowserContext; // Fixture for browser context
  page: Page; // Fixture for the page object
}>({
  // Browser context fixture with viewport size set to 1920x1080
  context: async ({ browser }, use) => {
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    await use(context);
    // Let Playwright handle closing the context after all tests
  },

  // Page fixture tied to the above context
  page: async ({ context }, use) => {
    const page = await context.newPage(); // Create a new page within the context
    await use(page); // Pass the page to tests
    // No need to manually close the page, Playwright handles this
  },
});


// Capture screenshot on test failure (as a fixture)
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === "failed") { // Check if the test failed
    const screenshotPath = join(screenshotDir, `${testInfo.title.replace(/[^a-zA-Z0-9]/g, "_")}.png`); // Define screenshot path
    await page.screenshot({ path: screenshotPath, fullPage: true }); // Capture a full-page screenshot
    console.log(`Screenshot captured at: ${screenshotPath}`); // Log screenshot path for debugging

    // Add a delay before the test is retried
    console.log("Test failed, waiting 61 seconds before retrying...");
    await new Promise(resolve => setTimeout(resolve, 61000));
  }
});

// Re-export Playwright"s expect for use in tests
export { expect };
