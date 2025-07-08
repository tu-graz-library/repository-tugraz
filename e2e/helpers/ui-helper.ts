// -*- coding: utf-8 -*-
//
// Copyright (C) 2025 Graz University of Technology.
//
// repository-tugraz is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { Locator, Page, expect } from "@playwright/test";

import { urls } from "../data/urls";

export class UIHelper {
  constructor(private page: Page) {}

  /* Navigate to the homepage */
  async navigateToHome(): Promise<void> {
    console.log("Navigating to the homepage...");
    await this.page.goto(urls.baseURL, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
  }

  /* Wait for element to be visible */
  async waitForElement(
    selector: string,
    timeout: number = 5000
  ): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: "visible", timeout });
    return element;
  }

  /* Check if element exists */
  async elementExists(selector: string): Promise<boolean> {
    try {
      await this.page
        .locator(selector)
        .waitFor({ state: "attached", timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /* Get text content of element */
  async getElementText(selector: string): Promise<string> {
    const element = await this.waitForElement(selector);
    const text = await element.textContent();
    return text?.trim() || "";
  }

  /* Get all text contents of elements matching selector */
  async getAllElementTexts(selector: string): Promise<string[]> {
    const elements = this.page.locator(selector);
    const count = await elements.count();
    const texts: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await elements.nth(i).textContent();
      if (text) {
        texts.push(text.trim());
      }
    }

    return texts;
  }

  /* Check if text is present on page */
  async isTextPresent(text: string): Promise<boolean> {
    try {
      this.page
        .locator(`text="${text}"`)
        .waitFor({ state: "visible", timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /* Get page title */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /* Take screenshot */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: "screenshots/" + name + ".png",
      fullPage: true,
    });
  }

  /* Scroll to element */
  async scrollToElement(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.scrollIntoViewIfNeeded();
  }

  /* Check if element has specific class */
  async elementHasClass(selector: string, className: string): Promise<boolean> {
    const element = this.page.locator(selector);
    const classAttribute = await element.getAttribute("class");
    return classAttribute?.includes(className) || false;
  }

  /* Get attribute value */
  async getAttributeValue(
    selector: string,
    attribute: string
  ): Promise<string | null> {
    const element = this.page.locator(selector);
    return await element.getAttribute(attribute);
  }

  /* Click element */
  async clickElement(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.click();
  }

  /* Fill input field */
  async fillInput(selector: string, value: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.fill(value);
  }

  /* Check if element is visible */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: "visible", timeout: 3000 });
      return await element.isVisible();
    } catch {
      return false;
    }
  }

  /* Get all elements matching selector */
  async getElements(selector: string): Promise<Locator> {
    return this.page.locator(selector);
  }

  /* Wait for page to load completely */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }
}
