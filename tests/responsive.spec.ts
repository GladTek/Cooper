import { test, expect } from '@playwright/test';

test.describe('Responsive', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test('should show mobile menu and links', async ({ page }) => {
    await page.goto('/en');
    
    // Wait for hydration
    await page.waitForTimeout(2000);
    
    // 1. Verify mobile menu button is visible
    const mobileMenuBtn = page.getByLabel(/Open Mobile Menu/i);
    await expect(mobileMenuBtn).toBeVisible();
    
    // 2. Click mobile menu
    await mobileMenuBtn.click();
    
    // 3. Verify menu panel is shown
    const menuPanel = page.getByRole('dialog');
    await expect(menuPanel).toBeVisible();
    
    // 4. Click a link in mobile menu (e.g., Docs or Resources)
    const resourcesLink = menuPanel.getByRole('link', { name: /Docs|Resources/i }).first();
    await expect(resourcesLink).toBeVisible();
    await resourcesLink.click();
    
    // 5. Verify navigation to docs or features
    await expect(page).not.toHaveURL(/\/en$/);
  });
});
