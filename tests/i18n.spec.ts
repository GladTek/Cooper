import { test, expect } from '@playwright/test';

test.describe('I18n', () => {
  test('should switch language from English to Arabic', async ({ page }) => {
    await page.goto('/en');
    
    // Wait for hydration
    await page.waitForTimeout(2000);
    
    // 1. Open language picker
    const toggle = page.locator('#language-toggle');
    await toggle.click();
    
    // 2. Click Arabic (العربية)
    // We can use the language code link or the name
    const arabicLink = page.getByRole('link', { name: /العربية/i });
    await arabicLink.click();
    
    // 3. Verify URL
    await expect(page).toHaveURL(/\/ar/);
    
    // 4. Verify localized text - expect some Arabic characters in the body
    const bodyText = await page.innerText('body');
    expect(bodyText).toMatch(/[\u0600-\u06FF]/);
  });

  test('should switch language from English to French', async ({ page }) => {
      await page.goto('/en');
      
      // Wait for hydration
      await page.waitForTimeout(2000);
      
      await page.locator('#language-toggle').click();
      
      const frenchLink = page.getByRole('link', { name: /Français/i });
      await frenchLink.click();
      
      await expect(page).toHaveURL(/\/fr/);
      
      // Verification: text should no longer be in English for the hero
      const bodyText = await page.innerText('body');
      expect(bodyText).not.toContain('Ship Faster with');
  });
});
