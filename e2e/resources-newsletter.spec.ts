import { test, expect } from '@playwright/test';

test.describe('Supporting flow: Resources → newsletter subscribe → success', () => {
  test('visitor can subscribe to new publications and reach the success confirmation', async ({
    page,
  }) => {
    await page.goto('/resources');
    await expect(
      page.getByText('Receive new publications and updates from The Baobab Group.'),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Subscribe' }).click();
    await expect(page.getByRole('alert').first()).toBeVisible();

    await page.locator('#dispatch-email').fill('reader@mfa.gov');
    await page.getByRole('button', { name: 'Subscribe' }).click();

    await expect(page.getByRole('button', { name: 'Return to homepage' })).toBeVisible();
  });
});
