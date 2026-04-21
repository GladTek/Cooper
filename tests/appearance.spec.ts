import { test, expect } from '@playwright/test';

test.describe('Appearance', () => {
  test('should toggle theme between light and dark', async ({ page }) => {
    await page.goto('/en');
    
    // 1. Get initial state (should be light or based on system, but let's assume we can toggle)
    const html = page.locator('html');
    const themeToggle = page.locator('#theme-toggle');
    
    const isInitialDark = await html.evaluate(el => el.classList.contains('dark'));
    
    // 2. Click toggle
    await themeToggle.click();
    
    // 3. Verify class changed
    if (isInitialDark) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }
    
    // 4. Verify localStorage
    const savedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(savedTheme).toBe(isInitialDark ? 'light' : 'dark');
    
    // 5. Toggle back
    await themeToggle.click();
    const finalIsDark = await html.evaluate(el => el.classList.contains('dark'));
    expect(finalIsDark).toBe(isInitialDark);
  });
});
