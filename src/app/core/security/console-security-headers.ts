/**
 * Response headers for every `/console` page. The console is an
 * authenticated admin area, so it must never be framed (clickjacking),
 * cached by a shared proxy or the back/forward cache, indexed, or
 * MIME-sniffed, and it leaks no referrer to outbound links.
 *
 * The CSP here is limited to directives that can't break Angular's own
 * bootstrap; script/style source lists are a separate, site-wide decision.
 * Mirrored in `netlify.toml` for any response served statically.
 */
export const CONSOLE_SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy':
    "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

const CONSOLE_PATH = /^\/console(?:\/|$)/;

export function withConsoleSecurityHeaders(pathname: string, response: Response): Response {
  if (!CONSOLE_PATH.test(pathname)) {
    return response;
  }
  // Responses from fetch/engines can carry immutable headers — copy first.
  const hardened = new Response(response.body, response);
  for (const [name, value] of Object.entries(CONSOLE_SECURITY_HEADERS)) {
    hardened.headers.set(name, value);
  }
  return hardened;
}
