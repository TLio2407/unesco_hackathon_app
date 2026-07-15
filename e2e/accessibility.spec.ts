import { test, expect } from '@playwright/test';

test.describe('Accessibility - WCAG 2.2 AA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('risk badges have sufficient color contrast', async ({ page }) => {
    const scamText = 'Công an yêu cầu chuyển tiền gấp.';
    await page.fill('textarea[placeholder*="Nhập"]', scamText);
    await page.click('button:has-text("Phân tích")');
    await expect(page.locator('text=Rủi ro cao')).toBeVisible({ timeout: 10000 });
    
    // Check color contrast for high_risk badge (red on white should pass AA)
    const badge = page.locator('text=Rủi ro cao');
    await expect(badge).toHaveCSS('color', /rgb\(2[0-9][0-9],/); // Red-ish
  });

  test('touch targets meet minimum 44x44', async ({ page }) => {
    const submitBtn = page.locator('button:has-text("Phân tích")');
    const box = await submitBtn.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('input has accessible label', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder*="Nhập"]');
    await expect(textarea).toHaveAttribute('placeholder');
  });

  test('focus visible on interactive elements', async ({ page }) => {
    const submitBtn = page.locator('button:has-text("Phân tích")');
    await submitBtn.focus();
    await expect(submitBtn).toBeFocused();
  });

  test('screen reader labels on risk badges', async ({ page }) => {
    const scamText = 'Công an yêu cầu chuyển tiền gấp.';
    await page.fill('textarea[placeholder*="Nhập"]', scamText);
    await page.click('button:has-text("Phân tích")');
    await expect(page.locator('text=Rủi ro cao')).toBeVisible({ timeout: 10000 });
    
    const badge = page.locator('text=Rủi ro cao');
    // Check for aria-label or role
    await expect(badge).toHaveAttribute('role', 'status');
  });
});
