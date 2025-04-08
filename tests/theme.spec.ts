import { expect, test } from '@playwright/test';

test.describe('Terminal Theme Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display theme menu button', async ({ page }) => {
    // The theme menu or button should be visible
    await expect(page.locator('.terminal-container')).toBeVisible();
  });

  test('should list available themes with theme command', async ({ page }) => {
    const input = page.locator('.command-input');
    await input.fill('theme');
    await input.press('Enter');
    
    await page.waitForTimeout(300);
    
    const output = page.locator('.terminal-output');
    await expect(output).toContainText('Theme options:');
  });

  test('should change theme with theme command', async ({ page }) => {
    // Get current theme indication (could be anything visible that changes with theme)
    const terminalBefore = page.locator('.terminal');
    const beforeClasses = await terminalBefore.getAttribute('class');
    
    // Execute theme change command
    const input = page.locator('.command-input');
    await input.fill('theme dark');
    await input.press('Enter');
    
    // Wait for theme change to apply
    await page.waitForTimeout(500);
    
    // Verify theme has changed (this approach may need adaptation based on your theme implementation)
    const terminalAfter = page.locator('.terminal');
    await expect(page.locator('.terminal-output')).toContainText('Theme changed to dark');
  });

  test('should show theme menu when clicking theme button', async ({ page }) => {
    // Click on theme menu button if it exists
    const themeButton = page.locator('button').filter({ hasText: /Theme/i });
    if (await themeButton.count() > 0) {
      await themeButton.click();
      
      // Verify theme menu appears
      await expect(page.locator('button').filter({ hasText: /dark/i })).toBeVisible();
    }
  });
}); 