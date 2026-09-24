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

/** Drives the archive's filter pills. */
export type ArchiveCategory = 'Transhumance' | 'Riparian & Water';

/**
 * One entry in the Treaties & Conciliation Archive
 * (`GET /api/v1/archive` — the same records the console's Archive screen
 * manages).
 */
export interface ArchiveEntry {
  id: string;
  refCode: string;
  regionTag: string;
  statusTag: string;
  title: string;
  description: string;
  ratifyingParties: string;
  workingLanguages: string;
  category: ArchiveCategory;
}

/** One item in the "Privacy & Sovereign Data Protections" 3-item summary grid. */
export interface ProtectionItem {
  icon: 'shield' | 'scales' | 'eye-off';
  tint: 'brand' | 'amber' | 'slate';
  title: string;
  description: string;
  badge: string;
}
