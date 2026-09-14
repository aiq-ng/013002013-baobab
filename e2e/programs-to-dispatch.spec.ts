import { test, expect } from '@playwright/test';

test.describe('Supporting flow: Programs → detail → confidential dispatch', () => {
  test('visitor can open a program detail page and submit the dispatch form', async ({ page }) => {
    await page.goto('/programs');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page
      .getByRole('link', { name: /View Program/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/programs\/[a-z0-9-]+$/);

    await page.locator('#dispatch-email').fill('delegate@example.org');
    await page.getByRole('button', { name: 'Request Dispatches' }).click();

    await expect(page.getByText('Confirmation reference')).toBeVisible();
  });
});
