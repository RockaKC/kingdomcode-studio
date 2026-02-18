// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Tab Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  test('Publications tab is active by default', async ({ page }) => {
    await expect(page.locator('.tab[data-tab="publications"]')).toHaveClass(/active/);
  });

  test('Publications tab content is visible by default', async ({ page }) => {
    await expect(page.locator('#publications')).toHaveClass(/active/);
  });

  test('Support and Resources tabs are not active by default', async ({ page }) => {
    await expect(page.locator('.tab[data-tab="support"]')).not.toHaveClass(/active/);
    await expect(page.locator('.tab[data-tab="resources"]')).not.toHaveClass(/active/);
  });

  test('Support and Resources tab content panels are hidden by default', async ({ page }) => {
    await expect(page.locator('#support')).not.toHaveClass(/active/);
    await expect(page.locator('#resources')).not.toHaveClass(/active/);
  });

  // ── Switching to Support ───────────────────────────────────────────────────

  test('clicking Support tab activates it', async ({ page }) => {
    await page.locator('.tab[data-tab="support"]').click();
    await expect(page.locator('.tab[data-tab="support"]')).toHaveClass(/active/);
  });

  test('clicking Support tab shows its content panel', async ({ page }) => {
    await page.locator('.tab[data-tab="support"]').click();
    await expect(page.locator('#support')).toHaveClass(/active/);
  });

  test('clicking Support tab deactivates Publications tab', async ({ page }) => {
    await page.locator('.tab[data-tab="support"]').click();
    await expect(page.locator('.tab[data-tab="publications"]')).not.toHaveClass(/active/);
    await expect(page.locator('#publications')).not.toHaveClass(/active/);
  });

  // ── Switching to Resources ─────────────────────────────────────────────────

  test('clicking Resources tab activates it', async ({ page }) => {
    await page.locator('.tab[data-tab="resources"]').click();
    await expect(page.locator('.tab[data-tab="resources"]')).toHaveClass(/active/);
  });

  test('clicking Resources tab shows its content panel', async ({ page }) => {
    await page.locator('.tab[data-tab="resources"]').click();
    await expect(page.locator('#resources')).toHaveClass(/active/);
  });

  test('clicking Resources tab hides Publications content', async ({ page }) => {
    await page.locator('.tab[data-tab="resources"]').click();
    await expect(page.locator('#publications')).not.toHaveClass(/active/);
  });

  // ── Only one tab active at a time ──────────────────────────────────────────

  test('exactly one tab button is active at any given time', async ({ page }) => {
    const tabs = ['support', 'resources', 'publications'];
    for (const tabName of tabs) {
      await page.locator(`.tab[data-tab="${tabName}"]`).click();
      const activeCount = await page.locator('.tab.active').count();
      expect(activeCount).toBe(1);
    }
  });

  test('exactly one content panel is active at any given time', async ({ page }) => {
    const tabs = ['support', 'resources', 'publications'];
    for (const tabName of tabs) {
      await page.locator(`.tab[data-tab="${tabName}"]`).click();
      const activePanelCount = await page.locator('.tab-content.active').count();
      expect(activePanelCount).toBe(1);
    }
  });

  // ── Active tab matches visible panel ──────────────────────────────────────

  test('active tab button matches the visible content panel', async ({ page }) => {
    const tabs = ['support', 'resources', 'publications'];
    for (const tabName of tabs) {
      await page.locator(`.tab[data-tab="${tabName}"]`).click();
      await expect(page.locator(`.tab[data-tab="${tabName}"]`)).toHaveClass(/active/);
      await expect(page.locator(`#${tabName}`)).toHaveClass(/active/);
    }
  });

  // ── Content integrity ──────────────────────────────────────────────────────

  test('Publications tab contains expected links', async ({ page }) => {
    await expect(page.locator('#publications a[href*="kingdomcode.substack.com"]')).toBeVisible();
    await expect(page.locator('#publications a[href*="kingdomcodegaming.substack.com"]')).toBeVisible();
    await expect(page.locator('#publications a[href*="patreon.com"]')).toBeVisible();
  });

  test('Support tab contains the Ko-fi link', async ({ page }) => {
    await page.locator('.tab[data-tab="support"]').click();
    await expect(page.locator('#support a[href*="ko-fi.com"]')).toBeVisible();
  });

  test('Resources tab contains the expected resource links', async ({ page }) => {
    await page.locator('.tab[data-tab="resources"]').click();
    const resourceLinks = page.locator('#resources a[href*="payhip.com"]');
    await expect(resourceLinks).toHaveCount(4);
  });
});
