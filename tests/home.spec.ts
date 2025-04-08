import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Verify the page loaded successfully
    await expect(page).toHaveURL('/');
  });

  test('should load without console errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check no errors were logged
    expect(errors).toHaveLength(0);
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto('/');
    
    // Verify the page title
    await expect(page).toHaveTitle(/XO_Works/);
  });

  test('should have Terminal component visible', async ({ page }) => {
    await page.goto('/');
    
    // Verify terminal is visible
    await expect(page.locator('.terminal-container')).toBeVisible();
    await expect(page.locator('.terminal-header')).toBeVisible();
    await expect(page.locator('.terminal-body')).toBeVisible();
  });

  test('should have main content visible', async ({ page }) => {
    await page.goto('/');
    
    // Verify main content is visible
    await expect(page.getByRole('main')).toBeVisible();
  });
}); 