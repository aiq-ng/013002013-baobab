import { test, expect } from '@playwright/test';

// Programs come from the registry API. Stub it in the browser so the flow
// doesn't depend on a running backend: when the server-side fetch fails, the
// page refetches in the browser and gets this stub. With a local backend up,
// the server-rendered real programs are used instead — hence no title check.
const PROGRAM = {
  slug: 'e2e-program',
  sortOrder: 1,
  updatedAt: '2026-01-01T00:00:00Z',
  title: 'E2E Dialogue Program',
  description: 'A program served by the stubbed registry.',
  imageUrl: '/images/programs/detail-hero-community-gathering.jpg',
  imageAlt: 'A community dialogue',
  badgeText: 'ALL REGIONS',
  aboutParagraphs: ['About paragraph.'],
  keyPoints: ['First key point'],
  strategyHeading: 'We support, not replace, state authority.',
  expectedImpact: 'Stronger trust between states and communities.',
  strategyImageUrl: '/images/home/spokesperson-portrait.jpg',
  strategyImageAlt: 'Portrait of a senior official',
};

test.describe('Supporting flow: Programs → detail → subscribe', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/\/api\/v1\/programs$/, (route) => route.fulfill({ json: [PROGRAM] }));
    await page.route(/\/api\/v1\/programs\/e2e-program$/, (route) =>
      route.fulfill({ json: PROGRAM }),
    );
  });

  test('visitor can open a program detail page and subscribe for updates', async ({ page }) => {
    await page.goto('/programs');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page
      .getByRole('link', { name: /View Program/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/programs\/[a-z0-9-]+$/);
    await expect(page.getByRole('heading', { level: 1 })).not.toBeEmpty();

    await page.locator('#dispatch-email').fill('delegate@example.org');
    await page.getByRole('button', { name: 'Subscribe' }).click();

    await expect(page.getByRole('button', { name: 'Return to homepage' })).toBeVisible();
  });
});
