import { test, expect } from '@playwright/test';

// Programs come from the registry API. Stub it in the browser so the flow
// doesn't depend on a running backend: when the server-side fetch fails, the
// page refetches in the browser and gets this stub. With a local backend up,
// the server-rendered real programs are used instead — hence no title check.
const PROGRAM = {
  slug: 'e2e-corridor',
  sortOrder: 1,
  updatedAt: '2026-01-01T00:00:00Z',
  title: 'E2E Peace Corridor',
  description: 'A program served by the stubbed registry.',
  imageUrl: '/images/shared/theaters/theater-liptako-gourma.jpg',
  imageAlt: 'A border crossing',
  theater: 'Sahel Central',
  badgeText: 'SAHEL CENTRAL',
  referenceCode: 'REF: BO-E2E-2026-T1',
  clearanceLevel: 'DIPLOMATIC CLEARANCE L1',
  statusTag: 'ACTIVE TRANSIT PROTOCOL',
  subtitle: 'Stubbed subtitle.',
  kpis: [{ value: '3', unit: 'Systems', label: 'States Bound' }],
  doctrineEyebrow: 'STRATEGIC OPERATIONAL DOCTRINE',
  doctrineHeading: 'Codified Corridors',
  doctrineParagraphs: ['Doctrine paragraph.'],
  doctrineImageUrl: '/images/shared/theaters/theater-liptako-gourma.jpg',
  doctrineImageCaption: 'SECTOR · Joint Mission',
  doctrineStats: [{ value: '184', unit: null, label: 'Village Pacts' }],
  pillarsEyebrow: 'GOVERNANCE ARCHITECTURE',
  pillarsHeading: 'Codified Operational Pillars',
  pillarsDescription: 'Pillars.',
  pillars: [
    {
      icon: '🕒',
      eyebrow: 'PILLAR I',
      title: 'Transit Windows',
      description: 'Fixed dates.',
      footnote: 'Synchronized',
    },
  ],
  timelineEyebrow: 'ACCORD TIMELINE',
  timelineHeading: 'Verified Accord Milestones',
  timelineDescription: 'Chronology.',
  milestones: [
    {
      date: 'October 2024',
      kicker: 'Diplomatic Decree',
      title: 'Charter Ratified',
      description: 'Codified.',
      tags: ['12 Border Posts'],
    },
  ],
  dispatchHeading: 'Request Confidential Addenda',
  dispatchSubtext: 'Restricted to accredited delegations.',
};

test.describe('Supporting flow: Programs → detail → confidential dispatch', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/\/api\/v1\/programs$/, (route) => route.fulfill({ json: [PROGRAM] }));
    await page.route(/\/api\/v1\/programs\/e2e-corridor$/, (route) =>
      route.fulfill({ json: PROGRAM }),
    );
  });

  test('visitor can open a program detail page and submit the dispatch form', async ({ page }) => {
    await page.goto('/programs');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page
      .getByRole('link', { name: /View Program/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/programs\/[a-z0-9-]+$/);
    await expect(page.getByRole('heading', { level: 1 })).not.toBeEmpty();

    await page.locator('#dispatch-email').fill('delegate@example.org');
    await page.getByRole('button', { name: 'Request Dispatches' }).click();

    await expect(page.getByText('Confirmation reference')).toBeVisible();
  });
});
