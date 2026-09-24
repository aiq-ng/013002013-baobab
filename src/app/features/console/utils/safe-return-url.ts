const FALLBACK = '/console/submissions';

/**
 * Only ever sends a freshly signed-in editor back into the console. The
 * `returnUrl` query param is attacker-controllable (anyone can mail a
 * sign-in link), so anything that isn't a plain `/console/…` path — an
 * absolute or protocol-relative URL, a backslash trick, a `..` escape, or
 * the sign-in page itself — falls back to the submissions queue.
 */
export function safeReturnUrl(raw: string | null | undefined): string {
  if (!raw) return FALLBACK;
  if (!raw.startsWith('/console/') || raw.includes('\\') || raw.includes('/../')) {
    return FALLBACK;
  }
  if (raw.startsWith('/console/sign-in')) {
    return FALLBACK;
  }
  return raw;
}
