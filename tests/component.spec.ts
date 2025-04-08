import { expect, test } from '@playwright/test';

test.describe('Terminal Component Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('should handle multiple commands in sequence', async ({ page }) => {
    const input = page.locator('.command-input');
    
    // First command
    await input.fill('help');
    await input.press('Enter');
    await page.waitForTimeout(300);
    
    // Verify first command output
    const output = page.locator('.terminal-output');
    await expect(output).toContainText('Available commands:');
    
    // Second command
    await input.fill('about');
    await input.press('Enter');
    await page.waitForTimeout(300);
    
    // Verify both commands are in history
    await expect(output).toContainText('help');
    await expect(output).toContainText('about');
  });

  test('should support keyboard navigation through command history', async ({ page }) => {
    const input = page.locator('.command-input');
    
    // Execute a command
    await input.fill('help');
    await input.press('Enter');
    await page.waitForTimeout(300);
    
    // Execute another command
    await input.fill('about');
    await input.press('Enter');
    await page.waitForTimeout(300);
    
    // Navigate back in history with up arrow
    await input.press('ArrowUp');
    await expect(input).toHaveValue('about');
    
    // Navigate further back
    await input.press('ArrowUp');
    await expect(input).toHaveValue('help');
  });

  test('should handle command with arguments', async ({ page }) => {
    const input = page.locator('.command-input');
    
    // Execute a command with arguments
    await input.fill('man help');
    await input.press('Enter');
    await page.waitForTimeout(300);
    
    // Check the output
    const output = page.locator('.terminal-output');
    await expect(output).toContainText('NAME');
    await expect(output).toContainText('help - display available commands');
  });
}); 