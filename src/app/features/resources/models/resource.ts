/** One entry in the Treaties & Conciliation Archive, filterable by `category`. */
export interface ArchiveEntry {
  refCode: string;
  regionTag: string;
  statusTag: string;
  title: string;
  description: string;
  ratifyingParties: string;
  workingLanguages: string;
  /** Drives the archive's filter pills ('Transhumance' | 'Riparian & Water'). */
  category: string;
}

/** One item in the "Privacy & Sovereign Data Protections" 3-item summary grid. */
export interface ProtectionItem {
  icon: 'shield' | 'scales' | 'eye-off';
  tint: 'brand' | 'amber' | 'slate';
  title: string;
  description: string;
  badge: string;
}
