import { ARCHIVE_ENTRIES, PROTECTION_ITEMS } from './resources.data';

describe('resources.data', () => {
  it('has three archive entries, each with a category matching a known filter', () => {
    expect(ARCHIVE_ENTRIES).toHaveLength(3);
    for (const entry of ARCHIVE_ENTRIES) {
      expect(['Transhumance', 'Riparian & Water']).toContain(entry.category);
    }
  });

  it('has unique reference codes for every archive entry', () => {
    expect(new Set(ARCHIVE_ENTRIES.map((e) => e.refCode)).size).toBe(ARCHIVE_ENTRIES.length);
  });

  it('has exactly 3 data protection items', () => {
    expect(PROTECTION_ITEMS).toHaveLength(3);
  });
});
