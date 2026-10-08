/**
 * One uploaded document from the actual backend resource registry
 * (`GET /api/v1/resources` — the same records the console's Resources screen
 * manages).
 */
export interface MetadataItem {
  label: string;
  value: string;
  accent: boolean;
}

export interface RegistryDocument {
  id: string;
  title: string;
  batchReference: string;
  languages: string;
  fileSizeBytes: number;
  downloadUrl: string | null;
  /** ISO timestamp; drives the "Uploaded: October 2026" label. */
  uploadedAt: string;
  /** Codex details (migration 0006): drives the featured "Resource Highlight" card. */
  batchLabel: string;
  releaseTag: string;
  documentDateLabel: string;
  description: string;
  chapters: string[];
  excerptHeading: string;
  excerptQuote: string;
  excerptAttribution: string;
  onlineUrl: string;
  metadata: MetadataItem[];
}
