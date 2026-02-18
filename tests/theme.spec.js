// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    // Start each test with a clean localStorage
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('defaults to dark theme when no preference is saved', async ({ page }) => {
    const dataTheme = await page.locator('html').getAttribute('data-theme');
    // Dark theme is the default: data-theme should be absent or empty
    expect(dataTheme === null || dataTheme === '').toBe(true);
  });

  test('restores saved light theme on page load', async ({ page }) => {
    // Simulate a previously saved light-theme preference
    await page.evaluate(() => localStorage.setItem('theme', 'light'));
    await page.reload();

    const dataTheme = await page.locator('html').getAttribute('data-theme');
    expect(dataTheme).toBe('light');
  });

  test('restores saved dark theme on page load', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));
    await page.reload();

    const dataTheme = await page.locator('html').getAttribute('data-theme');
    // Dark theme: data-theme should be absent or empty (not 'light')
    expect(dataTheme === null || dataTheme === '').toBe(true);
  });

  test('toggles from dark to light when button is clicked', async ({ page }) => {
    // Ensure we start in dark mode
    const themeToggle = page.locator('.theme-toggle');
    await themeToggle.click();

    const dataTheme = await page.locator('html').getAttribute('data-theme');
    expect(dataTheme).toBe('light');
  });

  test('toggles from light to dark when button is clicked twice', async ({ page }) => {
    const themeToggle = page.locator('.theme-toggle');
    await themeToggle.click(); // dark -> light
    await themeToggle.click(); // light -> dark

    const dataTheme = await page.locator('html').getAttribute('data-theme');
    expect(dataTheme === null || dataTheme === '').toBe(true);
  });

  test('persists new theme choice to localStorage after toggle', async ({ page }) => {
    const themeToggle = page.locator('.theme-toggle');
    await themeToggle.click(); // dark -> light

    const stored = await page.evaluate(() => localStorage.getItem('theme'));
    expect(stored).toBe('light');
  });

  test('persists dark theme to localStorage after toggling back', async ({ page }) => {
    const themeToggle = page.locator('.theme-toggle');
    await themeToggle.click(); // dark -> light
    await themeToggle.click(); // light -> dark

    const stored = await page.evaluate(() => localStorage.getItem('theme'));
    expect(stored).toBe('dark');
  });

  test('theme toggle button is visible and accessible', async ({ page }) => {
    const themeToggle = page.locator('.theme-toggle');
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toHaveAttribute('aria-label', 'Toggle theme');
  });

  test('theme persists across page reload', async ({ page }) => {
    // Switch to light
    await page.locator('.theme-toggle').click();
    await page.reload();

    const dataTheme = await page.locator('html').getAttribute('data-theme');
    expect(dataTheme).toBe('light');
  });
});
