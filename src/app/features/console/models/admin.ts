import { Program, ProgramContent } from '../../programs/models/program';

export interface AdminSession {
  email: string;
  role: string;
}

export type SubmissionStatus = 'new' | 'read' | 'actioned' | 'spam';

export interface AdminEngagement {
  id: string;
  referenceId: string;
  source: string;
  name: string;
  email: string;
  message: string | null;
  status: SubmissionStatus;
  submittedAt: string;
}

export interface AdminEngagementList {
  items: AdminEngagement[];
  total: number;
  page: number;
  pageSize: number;
}

export type AccessRequestState = 'pending' | 'approved' | 'denied' | 'expired' | 'redeemed';

export interface AdminAccessRequest {
  id: string;
  submissionId: string;
  referenceId: string;
  name: string;
  email: string;
  delegationToken: string | null;
  institution: string | null;
  state: AccessRequestState;
  createdAt: string;
}

/** Console and public site share one program shape — the console edits every field. */
export type AdminProgram = Program;

/** Body for `PUT /admin/programs/:slug` — the slug is the public URL and never changes. */
export type ProgramWrite = ProgramContent;

/** Body for `POST /admin/programs`. */
export type ProgramCreate = ProgramContent & { slug: string };

export interface AdminMetadataItem {
  label: string;
  value: string;
  accent: boolean;
}

export interface AdminResource {
  id: string;
  title: string;
  batchReference: string;
  languages: string;
  fileSizeBytes: number;
  uploadedAt: string;
  downloadUrl: string | null;
  /** Codex details (migration 0006): drives the public Resource Highlight card. */
  batchLabel: string;
  releaseTag: string;
  documentDateLabel: string;
  description: string;
  chapters: string[];
  excerptHeading: string;
  excerptQuote: string;
  excerptAttribution: string;
  onlineUrl: string;
  metadata: AdminMetadataItem[];
}

export type ArchiveCategory = 'Transhumance' | 'Riparian & Water';

export interface AdminArchiveEntry {
  id: string;
  refCode: string;
  regionTag: string;
  statusTag: string;
  title: string;
  description: string;
  ratifyingParties: string;
  workingLanguages: string;
  category: ArchiveCategory;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArchiveEntryWrite {
  refCode: string;
  regionTag: string;
  statusTag: string;
  title: string;
  description: string;
  ratifyingParties: string;
  workingLanguages: string;
  category: ArchiveCategory;
}

/** `POST /admin/media/image-uploads` — a one-off signed Cloudinary upload. */
export interface ImageUploadSignature {
  uploadUrl: string;
  /** Sent verbatim as multipart fields alongside `file`. */
  fields: Record<string, string>;
  maxBytes: number;
  allowedFormats: string[];
}

/** `POST /admin/resources` — a resource whose PDF is already on Cloudinary. */
export interface AdminResourceCreate {
  title: string;
  batchReference: string;
  languages: string;
  fileUrl: string;
  fileSizeBytes: number;
}

/** `PATCH /admin/resources/:id` — rename, optionally with a replacement PDF. */
export interface AdminResourceUpdate {
  title: string;
  batchReference: string;
  fileUrl?: string;
  fileSizeBytes?: number;
}

/** The subset of Cloudinary's upload response the console uses. */
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
}
