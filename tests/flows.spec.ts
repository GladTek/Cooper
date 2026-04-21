import { test, expect } from '@playwright/test';

test.describe('User Flows', () => {
  test('contact form submission should work', async ({ page }) => {
    await page.goto('/en/contact');
    
    // Wait for hydration
    await page.waitForTimeout(2000);
    
    // 1. Fill fields
    await page.getByPlaceholder(/John Doe/i).fill('John Doe');
    await page.getByPlaceholder(/john@example.com/i).fill('john@example.com');
    await page.getByPlaceholder(/How can we help you?/i).fill('This is a test message from Playwright.');
    
    // 2. Click submit (use specific locator to avoid name-shift during submission)
    const submitBtn = page.locator('main button[type="submit"]');
    await submitBtn.click();
    
    // 3. Verify it enters submitting state
    await expect(submitBtn).toBeDisabled();
    
    // 4. Verify Success message (simulated API delay is 2s)
    await expect(page.getByText(/Message Sent!/i)).toBeVisible({ timeout: 15000 });
  });

  test('search result click should navigate', async ({ page }) => {
    await page.goto('/en');
    
    // Wait for hydration
    await page.waitForTimeout(2000);
    
    // 1. Open search by clicking the button
    await page.getByRole('button', { name: /Search.../i }).click();
    const input = page.getByPlaceholder(/Search.../i);
    await expect(input).toBeVisible();
    
    // 2. Type "Astro"
    await input.fill('Astro');
    
    // 3. Wait for results container anchors
    const firstResult = page.locator('div.space-y-4 a').first();
    await expect(firstResult).toBeVisible({ timeout: 10000 });
    
    await firstResult.click();
    
    // 4. Verify navigation (we should no longer be on the home page)
    await expect(page).not.toHaveURL(/\/en\/?$/);
  });
});
