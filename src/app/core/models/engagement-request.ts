/** Identifies which of the site's 5 email-capture entry points produced a submission. */
export type EngagementSource =
  | 'home-dialogue'
  | 'programs-sovereign-dialogue'
  | 'program-confidential-dispatch'
  | 'resources-addendum'
  | 'resources-classified-access'
  | 'contact-form';

/** Typed request body for the shared (mocked) Engagement submission endpoint. */
export interface EngagementRequest {
  source: EngagementSource;
  name: string;
  email: string;
  message?: string;
  /** Free-form extra fields for source-specific forms (e.g. contact's phone/subject). */
  metadata?: Record<string, string>;
}

/** Response returned by `EngagementService.submit()`. */
export interface EngagementResponse {
  referenceId: string;
  submittedAt: string;
}
