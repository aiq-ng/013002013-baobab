import { Program, ProgramContent } from '../models/program';

/** A complete, valid program record for specs. Not imported by app code. */
export function makeProgram(overrides: Partial<Program> = {}): Program {
  return {
    slug: 'gourma-pastoral-wells-demarcation',
    sortOrder: 1,
    updatedAt: '2026-01-01T00:00:00Z',
    title: 'Gourma Pastoral Wells & Riparian Demarcation',
    description: 'Equitable dry-season water point governance.',
    imageUrl: '/images/shared/theaters/theater-gourma-pastoral-wells.jpg',
    imageAlt: 'A shared well at dusk',
    theater: 'Sahel Central',
    badgeText: 'SAHEL CENTRAL',
    referenceCode: 'REF: BO-GPW-2024-H1',
    clearanceLevel: 'DIPLOMATIC CLEARANCE L1',
    statusTag: 'ACTIVE HYDRAULIC ACCORD',
    subtitle: 'Equitable dry-season water point governance and ancestral aquifer pacts.',
    kpis: [
      { value: '3', unit: 'Systems', label: 'States Bound' },
      { value: '98%', unit: null, label: 'Community Acceptance' },
    ],
    doctrineEyebrow: 'STRATEGIC OPERATIONAL DOCTRINE',
    doctrineHeading: 'Codified Water Sharing and Seasonal Grazing Harmony',
    doctrineParagraphs: ['First doctrine paragraph.', 'Second doctrine paragraph.'],
    doctrineImageUrl: '/images/shared/theaters/theater-gourma-pastoral-wells.jpg',
    doctrineImageCaption: 'SECTOR GOURMA · Joint Mission',
    doctrineStats: [{ value: '184', unit: null, label: 'Village Pacts' }],
    pillarsEyebrow: 'GOVERNANCE ARCHITECTURE',
    pillarsHeading: 'Codified Operational Pillars',
    pillarsDescription: 'Tri-partite regulatory foundations.',
    pillars: [
      {
        icon: '🕒',
        eyebrow: 'PILLAR I',
        title: 'Hydraulic Rotational Clocks',
        description: 'Fixed watering rotations.',
        footnote: 'Synchronized with 12 wells',
      },
    ],
    timelineEyebrow: 'ACCORD TIMELINE',
    timelineHeading: 'Verified Accord Milestones & Field Chronicle',
    timelineDescription: 'Chronological documentation.',
    milestones: [
      {
        date: 'October 2024',
        kicker: 'Diplomatic Decree',
        title: 'Hombori Basin Water Allocation Framework Ratified',
        description: 'Formal codification.',
        tags: ['12 Wells'],
      },
    ],
    dispatchHeading: 'Request Confidential Addenda & Aquifer Telemetry Data',
    dispatchSubtext: 'Restricted to accredited delegations.',
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
