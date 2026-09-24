import { formatDate, formatFileSize, humanize, plural } from './format';

describe('console formatters', () => {
  it('formats ISO dates for tables and survives bad input', () => {
    expect(formatDate('2026-03-04T09:30:00Z')).toBe('Mar 4, 2026');
    expect(formatDate('not a date')).toBe('not a date');
  });

  it('humanizes machine identifiers', () => {
    expect(humanize('contact-form')).toBe('Contact form');
    expect(humanize('partnerships_dialogue')).toBe('Partnerships dialogue');
  });

  it('formats file sizes', () => {
    expect(formatFileSize(4_400_000)).toBe('4.2 MB');
    expect(formatFileSize(20_000)).toBe('20 KB');
  });

  it('pluralizes counts', () => {
    expect(plural(1, 'accord')).toBe('1 accord');
    expect(plural(6, 'accord')).toBe('6 accords');
    expect(plural(1, 'publication')).toBe('1 publication');
  });
});
