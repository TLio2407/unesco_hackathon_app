import { test, expect } from '@playwright/test';

test.describe('Companion Screen - Text Input', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('shows high_risk for impersonation scam', async ({ page }) => {
    const scamText = 
      'Thông báo từ Ngân hàng: Tài khoản của quý khách sắp bị khóa. ' +
      'Vui lòng bấm link https://nganhang-fake.com để xác minh trong 10 phút.';
    
    await page.fill('textarea[placeholder*="Nhập"]', scamText);
    await page.click('button:has-text("Phân tích")');
    
    await expect(page.locator('text=Rủi ro cao')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=giả mạo cơ quan')).toBeVisible();
    await expect(page.locator('text=áp lực thời gian')).toBeVisible();
    await expect(page.locator('text=đường link lạ')).toBeVisible();
    await expect(page.locator('text=Dừng lại 2 phút')).toBeVisible();
    await expect(page.locator('text=3 dấu hiệu cần nhớ')).toBeVisible();
  });

  test('shows high_risk for gift scam', async ({ page }) => {
    const scamText = 
      'CHÚC MỪNG! Bạn đã trúng thưởng iPhone 15. ' +
      'Chuyển ngay 200,000 VND phí xử lý để nhận quà.';
    
    await page.fill('textarea[placeholder*="Nhập"]', scamText);
    await page.click('button:has-text("Phân tích")');
    
    await expect(page.locator('text=Rủi ro cao')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=quà tặng bất thường')).toBeVisible();
    await expect(page.locator('text=chuyển tiền trước')).toBeVisible();
  });

  test('shows safe for benign text', async ({ page }) => {
    const safeText = 'Chào cô, chúc cô một ngày tốt lành.';
    
    await page.fill('textarea[placeholder*="Nhập"]', safeText);
    await page.click('button:has-text("Phân tích")');
    
    await expect(page.locator('text=An toàn')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Không phát hiện dấu hiệu')).toBeVisible();
  });
});
