import { Program, ProgramContent } from '../models/program';

/** A complete, valid program record for specs. Not imported by app code. */
export function makeProgram(overrides: Partial<Program> = {}): Program {
  return {
    slug: 'hybrid-mediation-reconciliation',
    sortOrder: 1,
    updatedAt: '2026-01-01T00:00:00Z',
    title: 'Hybrid Mediation & Reconciliation',
    description: 'Integrating traditional governance, religious legitimacy and modern mediation.',
    imageUrl: '/images/partnerships/plenary-assembly.jpg',
    imageAlt: 'Mediators in conversation around a table',
    badgeText: 'ALL REGIONS',
    aboutParagraphs: ['First about paragraph.', 'Second about paragraph.'],
    keyPoints: [
      'Reconciliation and confidence building',
      'Complements legitimate security efforts',
    ],
    strategyHeading: 'Preventing conflict and community stabilization.',
    expectedImpact: 'Stronger trust between states and communities.',
    strategyImageUrl: '/images/home/spokesperson-portrait.jpg',
    strategyImageAlt: 'Portrait of a senior official',
    ...overrides,
  };
}

/** The console's write body for a program: everything but the server-owned fields. */
export function contentOf(program: Program): ProgramContent {
  const content: Partial<Program> = { ...program };
  delete content.slug;
  delete content.sortOrder;
  delete content.updatedAt;
  return content as ProgramContent;
}

/** The console's create body: the write body plus the slug. */
export function createBodyOf(program: Program): ProgramContent & { slug: string } {
  return { ...contentOf(program), slug: program.slug };
}
