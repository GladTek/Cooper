import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load and show the main title', async ({ page }) => {
    await page.goto('/en');
    const brandName = page.getByText(/Cooper/i).first();
    await expect(brandName).toBeVisible();
    await expect(page.getByText(/Ship Faster with/i)).toBeVisible();
  });

  test('navigation to Docs should work via Get Started button', async ({ page }) => {
    await page.goto('/en');
    const getStartedBtn = page.getByRole('link', { name: /Get Started/i }).first();
    await getStartedBtn.click();
    await expect(page).toHaveURL(/\/docs/);
  });

  test('search palette should open when clicking the search button', async ({ page }) => {
    await page.goto('/en');
    
    // Wait for hydration
    await page.waitForTimeout(2000);
    
    // 1. Click search button
    const searchBtn = page.getByRole('button', { name: /Search.../i });
    await searchBtn.click();
    
    // 2. Check if search input is visible
    const input = page.getByPlaceholder(/Search.../i);
    await expect(input).toBeVisible({ timeout: 10000 });
  });
});
