import { safeReturnUrl } from './safe-return-url';

const FALLBACK = '/console/submissions';

describe('safeReturnUrl', () => {
  it('accepts an in-console path, including query and fragment', () => {
    expect(safeReturnUrl('/console/programs/abc?tab=1#top')).toBe(
      '/console/programs/abc?tab=1#top',
    );
  });

  it('falls back when nothing was supplied', () => {
    expect(safeReturnUrl(null)).toBe(FALLBACK);
    expect(safeReturnUrl('')).toBe(FALLBACK);
  });

  it.each([
    'https://evil.example/console',
    '//evil.example/console',
    '/\\evil.example',
    '\\\\evil.example',
    'javascript:alert(1)',
    '/about',
    '/console-evil',
    '/console/../about',
    '/console/sign-in',
  ])('rejects %s', (candidate) => {
    expect(safeReturnUrl(candidate)).toBe(FALLBACK);
  });
});
