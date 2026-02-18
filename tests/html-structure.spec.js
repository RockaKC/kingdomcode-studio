// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('HTML Structure & Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── Page skeleton ──────────────────────────────────────────────────────────

  test('renders the Kingdom Code logo/brand', async ({ page }) => {
    await expect(page.locator('.logo')).toContainText('Kingdom Code');
  });

  test('renders the tagline', async ({ page }) => {
    await expect(page.locator('.tagline')).toContainText('Ancient wisdom for modern warfare');
  });

  test('renders three navigation tabs', async ({ page }) => {
    await expect(page.locator('.tab')).toHaveCount(3);
  });

  test('tab labels are Publications, Support, Resources', async ({ page }) => {
    const labels = await page.locator('.tab').allTextContents();
    expect(labels).toEqual(['Publications', 'Support', 'Resources']);
  });

  test('renders three tab content panels', async ({ page }) => {
    await expect(page.locator('.tab-content')).toHaveCount(3);
  });

  test('renders footer with copyright text', async ({ page }) => {
    await expect(page.locator('.footer')).toContainText('Kingdom Code');
  });

  test('renders a contact/email link', async ({ page }) => {
    await expect(page.locator('a[href^="mailto:"]')).toBeVisible();
  });

  test('renders the status dot indicator', async ({ page }) => {
    await expect(page.locator('.status-dot')).toBeVisible();
  });

  // ── Link integrity ─────────────────────────────────────────────────────────

  test('Publications tab: main Substack link is present and correct', async ({ page }) => {
    const link = page.locator('#publications a[href="https://kingdomcode.substack.com/"]');
    await expect(link).toBeVisible();
    await expect(link.locator('.link-title')).toHaveText('Kingdom Code');
  });

  test('Publications tab: Gaming Substack link is present', async ({ page }) => {
    const link = page.locator('#publications a[href="https://kingdomcodegaming.substack.com/"]');
    await expect(link).toBeVisible();
    await expect(link.locator('.link-title')).toHaveText('Kingdom Code: Gaming');
  });

  test('Publications tab: Patreon link is present', async ({ page }) => {
    const link = page.locator('#publications a[href="https://patreon.com/KingdomCode"]');
    await expect(link).toBeVisible();
    await expect(link.locator('.link-title')).toHaveText('Become a Patron');
  });

  test('Support tab: Ko-fi link is present', async ({ page }) => {
    await page.locator('.tab[data-tab="support"]').click();
    const link = page.locator('#support a[href="https://ko-fi.com/kingdomcode/tip"]');
    await expect(link).toBeVisible();
    await expect(link.locator('.link-title')).toHaveText('One-Time Support');
  });

  test('Resources tab: shows four resource links', async ({ page }) => {
    await page.locator('.tab[data-tab="resources"]').click();
    await expect(page.locator('#resources .link-card')).toHaveCount(4);
  });

  test('contact link points to the correct email', async ({ page }) => {
    await expect(page.locator('a.contact-link')).toHaveAttribute('href', 'mailto:KingdomCode@proton.me');
  });

  // ── Responsive layout ──────────────────────────────────────────────────────

  test('page content is visible at 375px mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('.container')).toBeVisible();
    await expect(page.locator('.tabs')).toBeVisible();
  });

  test('page content is visible at 1280px desktop width', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('.container')).toBeVisible();
    await expect(page.locator('.tabs')).toBeVisible();
  });
});
