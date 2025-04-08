import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should pass accessibility tests on home page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the terminal to fully render
    await page.locator('.terminal-container').waitFor();
    
    // Run accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('.terminal-container')
      .analyze();
    
    // Check for critical accessibility violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('should have proper focus management', async ({ page }) => {
    await page.goto('/');
    
    // Verify the input field is focused automatically
    const inputField = page.locator('.command-input');
    await expect(inputField).toBeFocused();
    
    // Verify TAB key navigation works correctly
    await page.keyboard.press('Tab');
    // If there are tabbable elements after input, we should check focus moves appropriately
  });
  
  test('should have appropriate ARIA roles', async ({ page }) => {
    await page.goto('/');
    
    // Check that the terminal has proper ARIA role
    await expect(page.locator('.terminal-body')).toHaveAttribute('role', 'region');
    
    // Check that the terminal has proper aria-label
    await expect(page.locator('.terminal-body')).toHaveAttribute('aria-label', 'Terminal Interface');
  });
}); 