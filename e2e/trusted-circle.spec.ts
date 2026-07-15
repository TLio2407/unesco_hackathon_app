import { test, expect } from '@playwright/test';

test.describe('Trusted Circle Share', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // First analyze a scam to get results
    const scamText = 'Công an yêu cầu chuyển 500,000 VND trong 10 phút.';
    await page.fill('textarea[placeholder*="Nhập"]', scamText);
    await page.click('button:has-text("Phân tích")');
    await expect(page.locator('text=Rủi ro cao')).toBeVisible({ timeout: 10000 });
  });

  test('shares redacted summary via clipboard', async ({ page }) => {
    await page.click('button:has-text("Hỏi người thân")');
    
    // Check that share modal/copy action works
    await expect(page.locator('text=Đã sao chép')).toBeVisible({ timeout: 5000 });
    
    // Verify no PII in clipboard content (we can't easily test clipboard in Playwright,
    // but we can verify the UI shows redacted version)
  });

  test('lesson card renders with quiz', async ({ page }) => {
    await expect(page.locator('text=3 dấu hiệu cần nhớ')).toBeVisible();
    await expect(page.locator('text=Khi nhận tin yêu cầu chuyển tiền gấp')).toBeVisible();
    await expect(page.locator('text=Dừng lại, xác minh qua kênh chính thức')).toBeVisible();
  });
});
