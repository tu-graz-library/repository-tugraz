// -*- coding: utf-8 -*-
//
// Copyright (C) 2025 Graz University of Technology.
//
// repository-tugraz is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { BrowserContext, Page, test as base, expect } from "@playwright/test";

import { join } from "path";
import { mkdirSync } from "fs";

const screenshotDir = "./screenshots";
mkdirSync(screenshotDir, { recursive: true });

/* Custom test fixtures with browser context and page setup */
export const test = base.extend<{
  context: BrowserContext;
  page: Page;
}>({
  /* Browser context with custom viewport size */
  context: async ({ browser }, use) => {
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    await use(context);
  },

  /* Page instance within the browser context */
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
  },
});

/* Capture screenshot on test failure and add retry delay */
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === "failed") {
    const screenshotPath = join(screenshotDir, `${testInfo.title.replace(/[^a-zA-Z0-9]/g, "_")}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot captured at: ${screenshotPath}`);

    /* Add delay before retry to avoid rapid test execution */
    console.log("Test failed, waiting 61 seconds before retrying...");
    await new Promise(resolve => setTimeout(resolve, 61000));
  }
});

export { expect };
