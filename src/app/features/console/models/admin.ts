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
