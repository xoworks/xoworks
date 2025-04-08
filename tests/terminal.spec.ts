import { expect, test } from '@playwright/test';

test.describe('Terminal Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display terminal header with title', async ({ page }) => {
    await expect(page.locator('.terminal-title')).toBeVisible();
    await expect(page.locator('.terminal-title')).toHaveText('XO_Works Terminal');
  });

  test('should display terminal buttons', async ({ page }) => {
    await expect(page.locator('.terminal-buttons')).toBeVisible();
    await expect(page.locator('.terminal-button-close')).toBeVisible();
    await expect(page.locator('.terminal-button-minimize')).toBeVisible();
    await expect(page.locator('.terminal-button-maximize')).toBeVisible();
  });

  test('should display terminal prompt', async ({ page }) => {
    await expect(page.locator('.prompt')).toBeVisible();
    await expect(page.locator('.prompt-symbol')).toContainText('guest@xo.works');
    await expect(page.locator('.command-input')).toBeVisible();
  });

  test('should allow typing in terminal input', async ({ page }) => {
    const input = page.locator('.command-input');
    await input.fill('test command');
    await expect(input).toHaveValue('test command');
  });

  test('should process help command', async ({ page }) => {
    const input = page.locator('.command-input');
    await input.fill('help');
    await input.press('Enter');
    
    // Wait for command to be processed
    await page.waitForTimeout(300);
    
    // Verify command was executed and output is visible
    const output = page.locator('.terminal-output');
    await expect(output).toContainText('Available commands:');
  });

  test('should process about command', async ({ page }) => {
    const input = page.locator('.command-input');
    await input.fill('about');
    await input.press('Enter');
    
    await page.waitForTimeout(300);
    
    const output = page.locator('.terminal-output');
    await expect(output).toContainText('about');
  });

  test('should process services command', async ({ page }) => {
    const input = page.locator('.command-input');
    await input.fill('services');
    await input.press('Enter');
    
    await page.waitForTimeout(300);
    
    const output = page.locator('.terminal-output');
    await expect(output).toContainText('services');
  });

  test('should process contact command', async ({ page }) => {
    const input = page.locator('.command-input');
    await input.fill('contact');
    await input.press('Enter');
    
    await page.waitForTimeout(300);
    
    const output = page.locator('.terminal-output');
    await expect(output).toContainText('contact');
  });

  test('should clear terminal with clear command', async ({ page }) => {
    // First add some content to the terminal
    const input = page.locator('.command-input');
    await input.fill('help');
    await input.press('Enter');
    
    await page.waitForTimeout(300);
    
    // Verify content exists
    const outputBefore = page.locator('.terminal-output');
    await expect(outputBefore).toContainText('Available commands:');
    
    // Clear the terminal
    await input.fill('clear');
    await input.press('Enter');
    
    await page.waitForTimeout(300);
    
    // Verify content was cleared
    const outputAfter = page.locator('.terminal-output div');
    await expect(outputAfter).toHaveCount(0);
  });

  test('should show command not found for invalid commands', async ({ page }) => {
    const input = page.locator('.command-input');
    await input.fill('invalid_command');
    await input.press('Enter');
    
    await page.waitForTimeout(300);
    
    const output = page.locator('.terminal-output');
    await expect(output).toContainText('Command not found: invalid_command');
  });

  test('should show man page for a command', async ({ page }) => {
    const input = page.locator('.command-input');
    await input.fill('man help');
    await input.press('Enter');
    
    await page.waitForTimeout(300);
    
    const output = page.locator('.terminal-output');
    await expect(output).toContainText('NAME');
    await expect(output).toContainText('help - display available commands');
  });
}); 