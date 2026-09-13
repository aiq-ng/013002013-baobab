import { PROGRAMS, findProgramBySlug } from './programs.data';

describe('programs.data', () => {
  it('has six active programs with unique slugs', () => {
    expect(PROGRAMS).toHaveLength(6);
    expect(new Set(PROGRAMS.map((p) => p.slug)).size).toBe(6);
  });

  it('gives every program 4 KPIs, 3 pillars, and 3 milestones', () => {
    for (const program of PROGRAMS) {
      expect(program.kpis).toHaveLength(4);
      expect(program.pillars).toHaveLength(3);
      expect(program.milestones).toHaveLength(3);
    }
  });

  it('findProgramBySlug returns the matching program', () => {
    const program = findProgramBySlug('gourma-pastoral-wells-demarcation');
    expect(program?.title).toBe('Gourma Pastoral Wells & Riparian Demarcation');
  });

  it('findProgramBySlug returns undefined for an unknown or null slug', () => {
    expect(findProgramBySlug('not-a-real-program')).toBeUndefined();
    expect(findProgramBySlug(null)).toBeUndefined();
  });
});
