// -*- coding: utf-8 -*-
//
// Copyright (C) 2025 Graz University of Technology.
//
// repository-tugraz is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { test, expect } from "../utils/fixtures";
import { urls } from "../data/urls";

test.describe("application", () => {
  test("should load the homepage", async ({ page }) => {
    // Navigate to the homepage
    await page.goto(urls.baseURL);

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check that the page has loaded successfully
    expect(page.url()).toMatch(/https:\/\/127.0.0.1/);

    // You can add more specific checks here based on your application
    // For example:
    // await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".random-records-frontpage h2").first()).toHaveText("Research Results");
  });
});
