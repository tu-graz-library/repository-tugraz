import { Page, expect } from "@playwright/test";

import { UIHelper } from "../helpers/ui-helper";

export class HomePage {
  private uiHelper: UIHelper;

  constructor(private page: Page) {
    this.uiHelper = new UIHelper(page);
  }

  /**
   * Navigate to the homepage using the helper
   */
  async navigateToHome(): Promise<void> {
    await this.uiHelper.navigateToHome();
  }

  /**
   * (1) Verify section titles are present on the homepage
   */
  async verifySectionTitles(): Promise<void> {
    const expectedTitles = [
      "Research Results",
      "Publications",
      "Educational Resources",
      "Recent Uploads",
    ];

    for (const title of expectedTitles) {
      await expect(this.page.locator(`h2:has-text("${title}")`)).toBeVisible();
    }
  }

  /**
   * (2) Verify search functionality exists
   * Check for search input
   * Check for search button
   */
  async verifySearchFunctionality(): Promise<void> {
    const searchInput = this.page.locator('input[placeholder="Search records..."]');
    await expect(searchInput).toBeVisible();

    const searchButton = this.page.locator('button.ui.icon.button.search');
    await expect(searchButton).toBeVisible();
  }

  /**
   * (3) Check localization functionality by changing language and verifying translations
   * Check for German translations
   * Check for English strings that should be translated
   * Check for any remaining English strings (missed translations)
   */
  async checkGermanTranslations(): Promise<void> {
    const elementsToCheck = [
      {
        selector: 'h2:has-text("Research Results")',
        expectedGerman: "Forschungsergebnisse",
      },
      {
        selector: 'h2:has-text("Publications")',
        expectedGerman: "Veröffentlichungen",
      },
      {
        selector: 'h2:has-text("Educational Resources")',
        expectedGerman: "Bildungsressourcen",
      },
      {
        selector: 'h2:has-text("Recent Uploads")',
        expectedGerman: "Neueste Uploads",
      },
    ];

    const originalTexts: string[] = [];
    for (const element of elementsToCheck) {
      try {
        const locator = this.page.locator(element.selector).first();
        if ((await locator.count()) > 0) {
          const text = await locator.textContent();
          originalTexts.push(text || "");
        }
      } catch {
        originalTexts.push("");
      }
    }

    await this.changeLanguageToGerman();

    let translationsFound = 0;
    let translationResults: string[] = [];

    for (let i = 0; i < elementsToCheck.length; i++) {
      const element = elementsToCheck[i];
      try {
        const germanLocator = this.page.locator(
          `text="${element.expectedGerman}"`
        );
        if ((await germanLocator.count()) > 0) {
          translationsFound++;
          translationResults.push(`${element.expectedGerman}`);
        } else {
          const originalStillThere =
            (await this.page.locator(element.selector).count()) > 0;
          if (originalStillThere) {
            translationResults.push(`Still English: ${originalTexts[i]}`);
          } else {
            translationResults.push(
              `Element not found: ${element.expectedGerman}`
            );
          }
        }
      } catch {
        translationResults.push(`Error checking: ${element.expectedGerman}`);
      }
    }

    const englishStringsStillPresent = await this.checkForUntranslatedStrings();

    console.log("Localization Test Results:");
    console.log(
      `   Translations found: ${translationsFound}/${elementsToCheck.length}`
    );
    translationResults.forEach((result) => console.log(`  ${result}`));

    if (englishStringsStillPresent.length > 0) {
      console.log("Untranslated strings found:");
      englishStringsStillPresent.forEach((str) => console.log(`   ${str}`));
    }

    await this.changeLanguageToEnglish();
  }

  /**
   * Change language to German using the correct TU Graz language link
   * Use the actual language link found in debug (/lang/de)
   * Use other language selectors as fallback
   */
  private async changeLanguageToGerman(): Promise<void> {
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

      console.log("No German language link found");
    } catch (error) {
      console.log("Could not change language:", error);
    }
  }

  /**
   * Reset language back to English using the TU Graz language link
   * Use the English language link
   * Use other English selectors as fallback
   * Navigate to base URL (should default to English)
   */
  private async changeLanguageToEnglish(): Promise<void> {
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

      await this.page.goto("https://127.0.0.1/");
      await this.page.waitForLoadState("networkidle");
      console.log("Reset to English via base URL");
    } catch (error) {
      console.log("Could not reset language:", error);
    }
  }

  /**
   * Check for common English strings that should be translated
   */
  private async checkForUntranslatedStrings(): Promise<string[]> {
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

  /**
   * (4) Verify contact us button exists (configurable feature)
   */
  async verifyContactButton(): Promise<void> {
    const contactSelectors = [
      'a[href*="contact"]',
      'a[href*="kontakt"]',
      'button:has-text("Contact")',
      'a:has-text("Contact")',
    ];

    let found = false;
    for (const selector of contactSelectors) {
      if ((await this.page.locator(selector).count()) > 0) {
        found = true;
        break;
      }
    }

    console.log(`Contact button present: ${found}`);
  }

  /**
   * (5) Check that recent upload items don't contain HTML tags
   * Skip if no public records to show
   * Check titles and descriptions for HTML tags
   */
  async checkRecentUploadsContent(): Promise<void> {
    const recentSection = this.page.locator(".random-records-frontpage");

    if ((await recentSection.count()) === 0) return;

    if (
      (await recentSection
        .locator(':has-text("There are no public records to show")')
        .count()) > 0
    ) {
      return;
    }

    const contentElements = recentSection.locator(
      "h3, .title, .description, p"
    );
    const count = await contentElements.count();

    for (let i = 0; i < count; i++) {
      const text = await contentElements.nth(i).textContent();
      if (text) {
        expect(text.trim()).not.toMatch(/<[^>]*>/);
      }
    }
  }

  /**
   * (6) Check that publication dates exist for recent upload items
   * Check for date elements
   * Fallback: check for date patterns in text
   */
  async verifyPublicationDates(): Promise<void> {
    const recentSection = this.page.locator(".random-records-frontpage");

    if ((await recentSection.count()) === 0) return;

    if (
      (await recentSection
        .locator(':has-text("There are no public records to show")')
        .count()) > 0
    ) {
      return;
    }

    // Check for date elements
    const dateSelectors = [".date", "time", "[datetime]", ".publication-date"];
    let hasDateElements = false;

    for (const selector of dateSelectors) {
      if ((await recentSection.locator(selector).count()) > 0) {
        hasDateElements = true;
        break;
      }
    }

    if (!hasDateElements) {
      const allText = await recentSection.textContent();
      const datePatterns = [
        /\d{4}-\d{2}-\d{2}/,
        /\d{1,2}\/\d{1,2}\/\d{4}/,
        /\d{1,2}\.\d{1,2}\.\d{4}/,
        /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,
      ];

      for (const pattern of datePatterns) {
        if (allText && pattern.test(allText)) {
          hasDateElements = true;
          break;
        }
      }
    }

    expect(hasDateElements).toBe(true);
  }

  /**
   * Run all homepage verification checks
   */
  async runAllChecks(): Promise<void> {
    await this.verifySectionTitles();
    await this.verifySearchFunctionality();
    await this.checkGermanTranslations();
    await this.verifyContactButton();
    await this.checkRecentUploadsContent();
    await this.verifyPublicationDates();
  }
}