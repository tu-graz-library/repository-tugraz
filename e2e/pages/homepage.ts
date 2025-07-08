// -*- coding: utf-8 -*-
//
// Copyright (C) 2025 Graz University of Technology.
//
// repository-tugraz is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { Page } from "@playwright/test";
import { UIHelper } from "../helpers/ui-helper";

export class HomePage {
  private uiHelper: UIHelper;

  constructor(private page: Page) {
    this.uiHelper = new UIHelper(page);
  }

  /* Navigate to the homepage using the helper */
  async navigateToHome(): Promise<void> {
    await this.uiHelper.navigateToHome();
  }

  async getSectionTitles(): Promise<string[]> {
    return [
      "Research Results",
      "Publications",
      "Educational Resources",
      "Recent Uploads",
    ];
  }

  async getGermanTranslationElements(): Promise<
    Array<{ selector: string; expectedGerman: string }>
  > {
    return [
      {
        selector: 'h2:has-text("Research Results")',
        expectedGerman: "Forschungsergebnisse",
      },
      {
        selector: 'h2:has-text("Publications")',
        expectedGerman: "Publikationen",
      },
      {
        selector: 'h2:has-text("Educational Resources")',
        expectedGerman: "Bildungsinhalte",
      },
      {
        selector: 'h2:has-text("Recent Uploads")',
        expectedGerman: "Kürzlich hochgeladene Dateien",
      },
    ];
  }

  async changeLanguageToGerman(): Promise<void> {
    try {
      const germanLink = this.page.locator('a[href="/lang/de"]');
      if ((await germanLink.count()) > 0) {
        await germanLink.first().click();
        await this.page.waitForLoadState("networkidle");
        console.log("Switched to German via /lang/de link");
        return;
      }

      const germanLinkFallback = this.page.locator('a:has-text("DE"), a:has-text("Deutsch")');
      if ((await germanLinkFallback.count()) > 0) {
        await germanLinkFallback.first().click();
        await this.page.waitForLoadState("networkidle");
        console.log("Switched to German via DE/Deutsch link");
        return;
      }

      throw new Error("No German language link found");
    } catch (error) {
      console.log("Could not change language:", error);
      throw error;
    }
  }

  async changeLanguageToEnglish(): Promise<void> {
    try {
      const englishLink = this.page.locator('a[href="/lang/en"]');
      if ((await englishLink.count()) > 0) {
        await englishLink.first().click();
        await this.page.waitForLoadState("networkidle");
        console.log("Switched back to English via /lang/en link");
        return;
      }

      const englishLinkFallback = this.page.locator('a:has-text("EN"), a:has-text("English")');
      if ((await englishLinkFallback.count()) > 0) {
        await englishLinkFallback.first().click();
        await this.page.waitForLoadState("networkidle");
        console.log("Switched back to English via EN/English link");
        return;
      }

      await this.page.goto("/");
      await this.page.waitForLoadState("networkidle");
      console.log("Reset to English via base URL");
    } catch (error) {
      console.log("Could not reset language:", error);
      throw error;
    }
  }

  /* Check for common English strings that should be translated */
  async checkForUntranslatedStrings(): Promise<string[]> {
    const commonEnglishStrings = [
      "Search",
      "Login",
      "Home",
      "About",
      "Contact",
      "Upload",
      "Download",
      "View",
      "Edit",
      "Delete",
      "Save",
      "Cancel",
    ];

    const untranslated: string[] = [];

    for (const str of commonEnglishStrings) {
      const elements = this.page.locator(`text="${str}"`);
      if ((await elements.count()) > 0) {
        untranslated.push(str);
      }
    }

    return untranslated;
  }

  async isSectionTitleVisible(title: string): Promise<boolean> {
    const locator = this.page.locator(`h2:has-text("${title}")`);
    return await locator.isVisible();
  }

  async isSearchInputVisible(): Promise<boolean> {
    const searchInput = this.page.locator(
      'input[placeholder="Search records..."]'
    );
    return await searchInput.isVisible();
  }

  async isSearchButtonVisible(): Promise<boolean> {
    const searchButton = this.page.locator("button.ui.icon.button.search");
    return await searchButton.isVisible();
  }

  async checkForGermanTranslation(germanText: string): Promise<boolean> {
    const germanLocator = this.page.locator(`text="${germanText}"`);
    return (await germanLocator.count()) > 0;
  }

  async isContactButtonPresent(): Promise<boolean> {
    const contactSelectors = [
      'a[href*="contact"]',
      'a[href*="kontakt"]',
      'button:has-text("Contact")',
      'a:has-text("Contact")',
    ];

    for (const selector of contactSelectors) {
      if ((await this.page.locator(selector).count()) > 0) {
        return true;
      }
    }
    return false;
  }

  async getRecentUploadsSection() {
    return this.page.locator(".random-records-frontpage");
  }

  async hasNoPublicRecordsMessage(): Promise<boolean> {
    const recentSection = await this.getRecentUploadsSection();
    return (
      (await recentSection
        .locator(':has-text("There are no public records to show")')
        .count()) > 0
    );
  }

  async getRecentUploadsContentElements() {
    const recentSection = await this.getRecentUploadsSection();
    return recentSection.locator("h3, .title, .description, p");
  }

  async hasDateElements(): Promise<boolean> {
    const recentSection = await this.getRecentUploadsSection();
    const dateSelectors = [".date", "time", "[datetime]", ".publication-date"];

    for (const selector of dateSelectors) {
      if ((await recentSection.locator(selector).count()) > 0) {
        return true;
      }
    }
    return false;
  }

  async checkDatePatternsInText(): Promise<boolean> {
    const recentSection = await this.getRecentUploadsSection();
    const allText = await recentSection.textContent();
    const datePatterns = [
      /\d{4}-\d{2}-\d{2}/,
      /\d{1,2}\/\d{1,2}\/\d{4}/,
      /\d{1,2}\.\d{1,2}\.\d{4}/,
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,
    ];

    for (const pattern of datePatterns) {
      if (allText && pattern.test(allText)) {
        return true;
      }
    }
    return false;
  }
}
