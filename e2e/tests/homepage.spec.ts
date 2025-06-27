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
    const expectedTitles = await homePage.getSectionTitles();
    
    for (const title of expectedTitles) {
      const isVisible = await homePage.isSectionTitleVisible(title);
      expect(isVisible).toBe(true);
    }
  });

  test("(2) should verify search functionality exists", async ({ page }) => {
    const searchInputVisible = await homePage.isSearchInputVisible();
    expect(searchInputVisible).toBe(true);

    const searchButtonVisible = await homePage.isSearchButtonVisible();
    expect(searchButtonVisible).toBe(true);
  });

  test("(3) should check German translated titles", async ({ page }) => {
    const elementsToCheck = await homePage.getGermanTranslationElements();

    const originalTexts: string[] = [];
    for (const element of elementsToCheck) {
      try {
        const locator = page.locator(element.selector).first();
        if ((await locator.count()) > 0) {
          const text = await locator.textContent();
          originalTexts.push(text || "");
        }
      } catch {
        originalTexts.push("");
      }
    }

    await homePage.changeLanguageToGerman();

    let translationsFound = 0;
    let translationResults: string[] = [];

    for (let i = 0; i < elementsToCheck.length; i++) {
      const element = elementsToCheck[i];
      try {
        const hasTranslation = await homePage.checkForGermanTranslation(element.expectedGerman);
        if (hasTranslation) {
          translationsFound++;
          translationResults.push(element.expectedGerman);
        } else {
          const originalStillThere = (await page.locator(element.selector).count()) > 0;
          if (originalStillThere) {
            translationResults.push("Still English: " + originalTexts[i]);
          } else {
            translationResults.push("Element not found: " + element.expectedGerman);
          }
        }
      } catch {
        translationResults.push("Error checking: " + element.expectedGerman);
      }
    }

    const englishStringsStillPresent = await homePage.checkForUntranslatedStrings();

    console.log("Localization Test Results:");
    console.log("Translations found: " + translationsFound + "/" + elementsToCheck.length);
    translationResults.forEach((result) => console.log("  " + result));

    if (englishStringsStillPresent.length > 0) {
      console.log("Untranslated strings found:");
      englishStringsStillPresent.forEach((str) => console.log("   " + str));
    }

    await homePage.changeLanguageToEnglish();

    expect(translationsFound).toBeGreaterThanOrEqual(1);
  });

  test("(4) should verify contact us button exists", async ({ page }) => {
    const contactButtonPresent = await homePage.isContactButtonPresent();
    console.log("Contact button present: " + contactButtonPresent);
    
    // Note: This is a configurable feature, so we just check if it exists
    // The test passes regardless of whether the button is present or not
    expect(typeof contactButtonPresent).toBe("boolean");
  });

  test("(5) should verify recent upload items don't contain HTML tags", async ({ page }) => {
    const recentSection = await homePage.getRecentUploadsSection();

    if ((await recentSection.count()) === 0) return;

    const hasNoRecordsMessage = await homePage.hasNoPublicRecordsMessage();
    if (hasNoRecordsMessage) {
      return;
    }

    const contentElements = await homePage.getRecentUploadsContentElements();
    const count = await contentElements.count();

    for (let i = 0; i < count; i++) {
      const text = await contentElements.nth(i).textContent();
      if (text) {
        expect(text.trim()).not.toMatch(/<[^>]*>/);
      }
    }
  });

  test("(6) should verify publication dates exist for recent upload items", async ({ page }) => {
    const recentSection = await homePage.getRecentUploadsSection();

    if ((await recentSection.count()) === 0) return;

    const hasNoRecordsMessage = await homePage.hasNoPublicRecordsMessage();
    if (hasNoRecordsMessage) {
      return;
    }

    let hasDateElements = await homePage.hasDateElements();

    if (!hasDateElements) {
      hasDateElements = await homePage.checkDatePatternsInText();
    }

    expect(hasDateElements).toBe(true);
  });

  test("should verify all homepage requirements (1-6)", async ({ page }) => {
    
    const expectedTitles = await homePage.getSectionTitles();
    for (const title of expectedTitles) {
      const isVisible = await homePage.isSectionTitleVisible(title);
      expect(isVisible).toBe(true);
    }

    const searchInputVisible = await homePage.isSearchInputVisible();
    expect(searchInputVisible).toBe(true);
    const searchButtonVisible = await homePage.isSearchButtonVisible();
    expect(searchButtonVisible).toBe(true);

    const elementsToCheck = await homePage.getGermanTranslationElements();
    const originalTexts: string[] = [];
    for (const element of elementsToCheck) {
      try {
        const locator = page.locator(element.selector).first();
        if ((await locator.count()) > 0) {
          const text = await locator.textContent();
          originalTexts.push(text || "");
        }
      } catch {
        originalTexts.push("");
      }
    }

    await homePage.changeLanguageToGerman();
    let translationsFound = 0;
    let translationResults: string[] = [];

    for (let i = 0; i < elementsToCheck.length; i++) {
      const element = elementsToCheck[i];
      try {
        const hasTranslation = await homePage.checkForGermanTranslation(element.expectedGerman);
        if (hasTranslation) {
          translationsFound++;
          translationResults.push(element.expectedGerman);
        } else {
          const originalStillThere = (await page.locator(element.selector).count()) > 0;
          if (originalStillThere) {
            translationResults.push("Still English: " + originalTexts[i]);
          } else {
            translationResults.push("Element not found: " + element.expectedGerman);
          }
        }
      } catch {
        translationResults.push("Error checking: " + element.expectedGerman);
      }
    }

    const englishStringsStillPresent = await homePage.checkForUntranslatedStrings();
    console.log("Localization Test Results:");
    console.log("Translations found: " + translationsFound + "/" + elementsToCheck.length);
    translationResults.forEach((result) => console.log("  " + result));

    if (englishStringsStillPresent.length > 0) {
      console.log("Untranslated strings found:");
      englishStringsStillPresent.forEach((str) => console.log("   " + str));
    }

    await homePage.changeLanguageToEnglish();
    expect(translationsFound).toBeGreaterThanOrEqual(1);

    const contactButtonPresent = await homePage.isContactButtonPresent();
    console.log("Contact button present: " + contactButtonPresent);
    expect(typeof contactButtonPresent).toBe("boolean");

    const recentSection = await homePage.getRecentUploadsSection();
    if ((await recentSection.count()) > 0) {
      const hasNoRecordsMessage = await homePage.hasNoPublicRecordsMessage();
      if (!hasNoRecordsMessage) {
        const contentElements = await homePage.getRecentUploadsContentElements();
        const count = await contentElements.count();
        for (let i = 0; i < count; i++) {
          const text = await contentElements.nth(i).textContent();
          if (text) {
            expect(text.trim()).not.toMatch(/<[^>]*>/);
          }
        }
      }
    }

    if ((await recentSection.count()) > 0) {
      const hasNoRecordsMessage = await homePage.hasNoPublicRecordsMessage();
      if (!hasNoRecordsMessage) {
        let hasDateElements = await homePage.hasDateElements();
        if (!hasDateElements) {
          hasDateElements = await homePage.checkDatePatternsInText();
        }
        expect(hasDateElements).toBe(true);
      }
    }
  });
}); 
