/**
 * Every editable field of a program — the body the Registry Console sends to
 * `PUT /admin/programs/:slug`. List bounds are enforced server-side to fit the
 * detail layout: 1–6 "About this program" paragraphs, 1–6 key points.
 */
export interface ProgramContent {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  badgeText: string;

  aboutParagraphs: string[];

  keyPoints: string[];
  strategyHeading: string;
  expectedImpact: string;
  strategyImageUrl: string;
  strategyImageAlt: string;
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
