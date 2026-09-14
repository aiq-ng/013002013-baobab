import { test, expect } from '@playwright/test';

test.describe('Supporting flow: Resources → classified access gate → success', () => {
  test('visitor can submit the classified access gate form to a success confirmation', async ({
    page,
  }) => {
    await page.goto('/resources');
    await expect(page.getByText('Track 1.5 Access Gate')).toBeVisible();

    await page.locator('#classified-email').fill('envoy@diplomatie.gouv');
    await page.getByRole('button', { name: 'Request Classified Dossier Access' }).click();

    await expect(page.getByText('Confirmation reference')).toBeVisible();
  });
});
