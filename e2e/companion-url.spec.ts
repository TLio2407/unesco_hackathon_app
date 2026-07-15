import { test, expect } from '@playwright/test';

test.describe('Companion Screen - URL Input', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('analyzes suspicious URL', async ({ page }) => {
    await page.click('button:has-text("URL")');
    await page.fill('textarea[placeholder*="Nhập"]', 'nganhang-fake.com/xac-minh');
    await page.click('button:has-text("Phân tích")');
    
    await expect(page.locator('text=Rủi ro cao')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=đường link lạ')).toBeVisible();
  });

  test('auto-adds https to bare domain', async ({ page }) => {
    await page.click('button:has-text("URL")');
    await page.fill('textarea[placeholder*="Nhập"]', 'example.com');
    await page.click('button:has-text("Phân tích")');
    
    await expect(page.locator('text=example.com')).toBeVisible({ timeout: 10000 });
  });
});
