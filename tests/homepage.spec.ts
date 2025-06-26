// -*- coding: utf-8 -*-
//
// Copyright (C) 2025 Graz University of Technology.
//
// repository-tugraz is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { expect, test } from "../utils/fixtures";

import { HomePage } from "../pages/homepage";

test.describe("Homepage Tests", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test("(1) should verify all section titles are present", async ({ page }) => {
    await homePage.verifySectionTitles();
  });

  test("(2) should verify search functionality exists", async ({ page }) => {
    await homePage.verifySearchFunctionality();
  });

  test("(3) should check German translated titles", async ({ page }) => {
    await homePage.checkGermanTranslations();
  });

  test("(4) should verify contact us button exists", async ({ page }) => {
    await homePage.verifyContactButton();
  });

  test("(5) should verify recent upload items don't contain HTML tags", async ({ page }) => {
    await homePage.checkRecentUploadsContent();
  });

  test("(6) should verify publication dates exist for recent upload items", async ({ page }) => {
    await homePage.verifyPublicationDates();
  });

  test("should verify all homepage requirements (1-6)", async ({ page }) => {
    await homePage.runAllChecks();
  });
}); 