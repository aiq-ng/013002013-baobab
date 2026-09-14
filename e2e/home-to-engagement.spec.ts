import { test, expect } from '@playwright/test';

test.describe('Primary flow: Home → browse → initiate engagement → submit → success', () => {
  test('visitor can browse from Home and submit the dialogue form to a success confirmation', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/The Baobab Group/);

    await page.getByRole('link', { name: 'Programs', exact: true }).click();
    await expect(page).toHaveURL(/\/programs$/);

    await page.goto('/');
    await page.getByRole('button', { name: /Initiate Dialogue/ }).click();

    await page.locator('#home-dialogue-name').fill('Amina Diallo');
    await page.locator('#home-dialogue-email').fill('amina@mfa.gov');
    await page.getByRole('button', { name: 'Send Request' }).click();

    await expect(page.getByText('Confirmation reference')).toBeVisible();
    await expect(page.locator('p.font-mono')).toHaveText(/BB-/);

    await page.getByRole('button', { name: 'Return to homepage' }).click();
    await expect(page).toHaveURL('/');
  });
});
