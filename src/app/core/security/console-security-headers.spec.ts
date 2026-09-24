import { CONSOLE_SECURITY_HEADERS, withConsoleSecurityHeaders } from './console-security-headers';

describe('withConsoleSecurityHeaders', () => {
  const html = () => new Response('<html></html>', { headers: { 'content-type': 'text/html' } });

  it.each(['/console', '/console/', '/console/programs/abc'])(
    'hardens %s against framing, caching, indexing and sniffing',
    (path) => {
      const response = withConsoleSecurityHeaders(path, html());

      expect(response.headers.get('x-frame-options')).toBe('DENY');
      expect(response.headers.get('content-security-policy')).toContain("frame-ancestors 'none'");
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
      expect(response.headers.get('x-content-type-options')).toBe('nosniff');
      expect(response.headers.get('referrer-policy')).toBe('no-referrer');
      expect(response.headers.get('content-type')).toBe('text/html');
    },
  );

  it('leaves public pages untouched', () => {
    const original = html();
    expect(withConsoleSecurityHeaders('/programs', original)).toBe(original);
    expect(withConsoleSecurityHeaders('/consoles', original)).toBe(original);
  });

  it('keeps the status and body', async () => {
    const response = withConsoleSecurityHeaders('/console', new Response('shell', { status: 200 }));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('shell');
  });

  it('exposes the header set for static-hosting config parity', () => {
    expect(Object.keys(CONSOLE_SECURITY_HEADERS)).toContain('Permissions-Policy');
  });
});
