import { RegistryDocument } from '../models/resource';

/** A complete published `RegistryDocument`; override only what a spec cares about. */
export function createRegistryDocument(
  overrides: Partial<RegistryDocument> = {},
): RegistryDocument {
  return {
    id: 'doc-1',
    title: 'Policy Advisory & Regional Harmonization',
    batchReference: 'BBG-2026-001',
    languages: 'English',
    fileSizeBytes: 2_400_000,
    downloadUrl: 'https://cdn.example.com/doc-1.pdf',
    uploadedAt: '2026-10-02T09:00:00Z',
    batchLabel: 'Batch 01',
    releaseTag: '',
    documentDateLabel: '',
    description:
      'Transforming local successes into regional policy guidance and standards across ECOWAS and AES.',
    chapters: [],
    excerptHeading: '',
    excerptQuote: '',
    excerptAttribution: '',
    onlineUrl: '',
    metadata: [],
    ...overrides,
  };
}
