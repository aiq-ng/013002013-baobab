import { test, expect, Page, Route } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { makeProgram } from '../src/app/features/programs/testing/program-fixture';

/**
 * Registry Console flows against a mocked admin API (the real backend isn't
 * part of the frontend's E2E run). Every screen is also audited with axe for
 * WCAG 2.2 A/AA violations.
 */

const API = 'http://localhost:8000/api/v1/admin';
const SESSION = { email: 'officer@baobab.org', role: 'editor' };

const PROGRAMS = [
  makeProgram({ slug: 'liptako-gourma', sortOrder: 1, title: 'Liptako-Gourma Peace Corridor' }),
  makeProgram({ slug: 'lake-chad', sortOrder: 2, title: 'Lake Chad Customary Demobilization' }),
];

const SUBMISSIONS = {
  items: [
    {
      id: 'e1',
      referenceId: 'BB-2026-0001',
      source: 'contact-form',
      name: 'Amina Diallo',
      email: 'amina@mfa.gov',
      message: 'We would like to open a dialogue.',
      status: 'new',
      submittedAt: '2026-03-04T09:30:00Z',
    },
  ],
  total: 1,
  page: 1,
  pageSize: 25,
};

const ARCHIVE = [
  {
    id: 'a1',
    refCode: 'REF: BBG-LQ-2023-TRX',
    regionTag: 'Sahel Central Basin',
    statusTag: 'Ratified: November 2023',
    title: 'Liptako-Gourma Tri-Border Accord',
    description: 'Corridor demarcations.',
    ratifyingParties: 'Mali, Niger, Burkina Faso',
    workingLanguages: 'Français, Hausa',
    category: 'Transhumance',
    published: true,
    createdAt: '2023-11-01T00:00:00Z',
    updatedAt: '2023-11-01T00:00:00Z',
  },
];

async function mockAdminApi(page: Page, { signedIn }: { signedIn: boolean }): Promise<void> {
  let session = signedIn;
  const json = (route: Route, body: unknown, status = 200) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

  await page.route(`${API}/**`, async (route) => {
    const url = new URL(route.request().url());
    const method = route.request().method();
    const path = url.pathname.replace('/api/v1/admin/', '');

    if (path === 'session') {
      if (method === 'POST') {
        session = true;
        return json(route, SESSION);
      }
      if (method === 'DELETE') {
        session = false;
        return route.fulfill({ status: 204 });
      }
      return session ? json(route, SESSION) : json(route, { detail: 'Not signed in.' }, 401);
    }
    if (!session) return json(route, { detail: 'Not signed in.' }, 401);

    if (path === 'programs' && method === 'GET') return json(route, PROGRAMS);
    if (path.startsWith('programs/') && method === 'PUT') {
      return json(route, { ...PROGRAMS[0], ...route.request().postDataJSON() });
    }
    if (path === 'engagements') return json(route, SUBMISSIONS);
    if (path === 'access-requests') return json(route, []);
    if (path === 'resources') return json(route, []);
    if (path === 'archive') return json(route, ARCHIVE);
    return json(route, { detail: 'Unhandled in mock' }, 404);
  });
}

async function expectNoA11yViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const summary = results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  );
  expect(summary, summary.join('\n')).toEqual([]);
}

test.describe('Registry Console', () => {
  // Each test compiles lazy console chunks on a dev server and runs axe several times; in
  // parallel they starve each other of CPU, so this suite runs serially.
  test.describe.configure({ mode: 'serial', timeout: 120_000 });

  test('signs in, returns to the requested page, and passes an accessibility audit', async ({
    page,
  }) => {
    await mockAdminApi(page, { signedIn: false });

    await page.goto('/console/programs');
    await expect(page).toHaveURL(/\/console\/sign-in\?returnUrl=%2Fconsole%2Fprograms/);
    await expectNoA11yViolations(page);

    await page.getByRole('button', { name: /Sign in/ }).click();
    await expect(page.locator('#email-error')).toHaveText('Enter your email address.');

    await page.getByLabel('Official email address').fill('officer@baobab.org');
    await page.getByLabel('Password', { exact: true }).fill('correct horse');
    await page.getByRole('button', { name: /Sign in/ }).click();

    await expect(page).toHaveURL(/\/console\/programs$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Programs' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Programs' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expectNoA11yViolations(page);
  });

  test('edits a program and lands on the published confirmation', async ({ page }) => {
    await mockAdminApi(page, { signedIn: true });
    await page.goto('/console/programs');

    await page.getByRole('link', { name: 'Edit Liptako-Gourma Peace Corridor' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Edit: Liptako-Gourma');
    await expectNoA11yViolations(page);

    await page
      .getByLabel('Header', { exact: true })
      .fill('Liptako-Gourma Peace Corridor (Phase II)');
    await page.getByRole('button', { name: 'Publish program' }).click();

    const heading = page.getByRole('heading', { level: 1, name: 'Program Updated & Published' });
    await expect(heading).toBeVisible();
    await expect(heading).toBeFocused();
    await expect(page.getByRole('link', { name: /View on Public Site/ })).toHaveAttribute(
      'href',
      '/programs/liptako-gourma',
    );
    await expectNoA11yViolations(page);
  });

  test('blocks an invalid publish and focuses the first problem', async ({ page }) => {
    await mockAdminApi(page, { signedIn: true });
    await page.goto('/console/programs/liptako-gourma');

    await page.getByLabel('Header', { exact: true }).fill('   ');
    await page.getByRole('button', { name: 'Publish program' }).click();

    await expect(page.getByLabel('Header', { exact: true })).toBeFocused();
    await expect(page.getByLabel('Header', { exact: true })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await expect(page.locator('#title-error')).toHaveText(/Header is required/);
  });

  test('guards unsaved edits against in-app navigation', async ({ page }) => {
    await mockAdminApi(page, { signedIn: true });
    await page.goto('/console/programs/liptako-gourma');

    await page.getByLabel('Header', { exact: true }).fill('Half-finished edit');
    await page.getByRole('link', { name: 'Submissions' }).click();

    const dialog = page.getByRole('alertdialog', { name: 'Discard unsaved changes?' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Keep editing' })).toBeFocused();
    await dialog.getByRole('button', { name: 'Keep editing' }).click();
    await expect(page).toHaveURL(/\/console\/programs\/liptako-gourma$/);
    await expect(page.getByLabel('Header', { exact: true })).toHaveValue('Half-finished edit');
  });

  test('confirms before deleting an archive entry, with focus on the safe choice', async ({
    page,
  }) => {
    await mockAdminApi(page, { signedIn: true });
    await page.goto('/console/archive');
    await expectNoA11yViolations(page);

    await page.getByRole('button', { name: 'Delete Liptako-Gourma Tri-Border Accord' }).click();
    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toContainText('cannot be undone');
    await expect(dialog.getByRole('button', { name: 'Keep entry' })).toBeFocused();
    await expectNoA11yViolations(page);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(
      page.getByRole('button', { name: 'Delete Liptako-Gourma Tri-Border Accord' }),
    ).toBeFocused();
  });

  test('opens a submission from the keyboard and reads it in an accessible drawer', async ({
    page,
  }) => {
    await mockAdminApi(page, { signedIn: true });
    await page.goto('/console/submissions');
    await expectNoA11yViolations(page);

    await page.getByRole('button', { name: 'Open submission BB-2026-0001' }).focus();
    await page.keyboard.press('Enter');
    const drawer = page.getByRole('dialog', { name: 'Submission detail' });
    await expect(drawer).toContainText('amina@mfa.gov');
    await expectNoA11yViolations(page);
  });

  test('collapses navigation behind a toggle on phones', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await mockAdminApi(page, { signedIn: true });
    await page.goto('/console/submissions');

    const toggle = page.getByRole('button', { name: 'Open navigation' });
    await expect(page.getByRole('link', { name: 'Treaties Archive' })).toBeHidden();
    await toggle.click();
    await page.getByRole('link', { name: 'Treaties Archive' }).click();
    await expect(page).toHaveURL(/\/console\/archive$/);
    await expect(page.getByRole('link', { name: 'Treaties Archive' })).toBeHidden();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(375);
    await expectNoA11yViolations(page);
  });
});
