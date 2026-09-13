/** A single named number used in KPI stat rows and inline doctrine stats. */
export interface ProgramStat {
  value: string;
  unit?: string;
  label: string;
}

/** One of a program's three codified operational pillars. */
export interface ProgramPillar {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  footnote: string;
}

/** One dated accord milestone in a program's field chronicle. */
export interface ProgramMilestone {
  date: string;
  kicker: string;
  title: string;
  description: string;
  tags: string[];
}

/**
 * Full data-driven record for one program. `program/:slug` renders a single
 * detail template against whichever record matches the route slug.
 */
export interface Program {
  slug: string;
  theater: string;
  badgeText: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;

  referenceCode: string;
  clearanceLevel: string;
  statusTag: string;
  subtitle: string;
  kpis: ProgramStat[];

  doctrineEyebrow: string;
  doctrineHeading: string;
  doctrineParagraphs: string[];
  doctrineImageUrl: string;
  doctrineImageCaption: string;
  doctrineStats: ProgramStat[];

  pillarsEyebrow: string;
  pillarsHeading: string;
  pillarsDescription: string;
  pillars: ProgramPillar[];

  timelineEyebrow: string;
  timelineHeading: string;
  timelineDescription: string;
  milestones: ProgramMilestone[];

  dispatchHeading: string;
  dispatchSubtext: string;
}
