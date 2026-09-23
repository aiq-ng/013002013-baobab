/**
 * Layout guard: container padding must be mobile-first.
 *
 * Sections nest — a page section's `px-4`, a tinted panel's padding, a card's padding, and an
 * inner figure's padding all stack on the same axis. On a 375px screen a chain of fixed `p-6`/
 * `p-8` containers eats 80px of gutter per side and squeezes the content to a column of broken
 * words. So no container may apply large padding at the mobile base breakpoint: start small and
 * scale up with `sm:`/`lg:`, or consume one of the `.pad-*` recipes in `styles.css`.
 */
// `import.meta.glob` is statically replaced by Vite, so it must appear verbatim; the Angular
// compiler's ImportMeta type doesn't declare it, hence the suppression rather than widening
// the app's global types.
// @ts-expect-error -- Vite-only API, resolved at transform time.
const templates: Record<string, string> = import.meta.glob('/src/app/**/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/**
 * Horizontal padding too large to apply unconditionally at the mobile base breakpoint.
 * Only the horizontal axis matters here: generous `py-*` gives sections vertical rhythm and
 * costs no line width, whereas every `p-*`/`px-*` in a nesting chain narrows the text column.
 */
const OVERSIZED_BASE_PADDING = /(?:^|\s)px?-(?:8|10|12|14|16|20)(?=\s|$)/;

describe('responsive container padding', () => {
  it('finds the component templates to scan', () => {
    expect(Object.keys(templates).length).toBeGreaterThan(20);
  });

  it('never applies oversized padding at the mobile base breakpoint', () => {
    const offenders: string[] = [];

    for (const [path, html] of Object.entries(templates)) {
      for (const attr of html.match(/class="[^"]*"/g) ?? []) {
        const classes = attr.slice(7, -1);
        // Responsive variants (sm:p-8) carry a prefix and are exactly what we want people to use.
        const baseClasses = classes
          .split(/\s+/)
          .filter((c) => !c.includes(':'))
          .join(' ');

        if (OVERSIZED_BASE_PADDING.test(baseClasses)) {
          offenders.push(`${path}: ${classes}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
