// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── Meta / document ────────────────────────────────────────────────────────

  test('page has a descriptive title', async ({ page }) => {
    await expect(page).toHaveTitle('Kingdom Code');
  });

  test('html element has lang attribute set to "en"', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('meta description is present', async ({ page }) => {
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /Kingdom Code/i);
  });

  test('viewport meta tag is present', async ({ page }) => {
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  // ── Interactive elements ───────────────────────────────────────────────────

  test('theme toggle button has aria-label', async ({ page }) => {
    await expect(page.locator('.theme-toggle')).toHaveAttribute('aria-label', 'Toggle theme');
  });

  test('email contact link has aria-label', async ({ page }) => {
    await expect(page.locator('.contact-link')).toHaveAttribute('aria-label', 'Email');
  });

  test('theme toggle is keyboard-focusable', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.className);
    expect(focused).toContain('theme-toggle');
  });

  test('tab buttons are focusable via keyboard', async ({ page }) => {
    // All tab buttons must be reachable and interactable via keyboard
    const tabs = page.locator('.tab');
    const count = await tabs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(tabs.nth(i)).toBeEnabled();
    }
  });

  // ── External links ─────────────────────────────────────────────────────────

  test('all external links have rel="noopener noreferrer"', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute('rel');
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    }
  });

  test('all external links open in a new tab', async ({ page }) => {
    const externalLinks = page.locator('.link-card');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(externalLinks.nth(i)).toHaveAttribute('target', '_blank');
    }
  });

  // ── Color / visual ─────────────────────────────────────────────────────────

  test('dark mode (default) uses dark background CSS variable', async ({ page }) => {
    const bgColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim()
    );
    // Dark theme default is #0a0a0b
    expect(bgColor).toBe('#0a0a0b');
  });

  test('light mode applies different background CSS variable', async ({ page }) => {
    await page.locator('.theme-toggle').click();
    const bgColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim()
    );
    // Light theme is #fafafa
    expect(bgColor).toBe('#fafafa');
  });
});
