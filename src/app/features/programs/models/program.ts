/** A single named number used in KPI stat rows and inline doctrine stats. */
export interface ProgramStat {
  value: string;
  unit?: string | null;
  label: string;
}

/** One of a program's codified operational pillars (up to three). */
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
 * Every editable field of a program — the body the Registry Console sends to
 * `PUT /admin/programs/:slug`. List bounds are enforced server-side to fit the
 * detail layout: 1–4 KPIs, 1–3 doctrine stats, 1–3 pillars.
 */
export interface ProgramContent {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  theater: string;
  badgeText: string;

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

/**
 * Full program record as served by `GET /api/v1/programs[/:slug]`.
 * `program/:slug` renders a single detail template against whichever record
 * matches the route slug.
 */
export interface Program extends ProgramContent {
  slug: string;
  sortOrder: number;
  updatedAt: string;
}
