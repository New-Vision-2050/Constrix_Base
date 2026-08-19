export type DocumentStatus =
  | "draft"
  | "pending"
  | "approved"
  | "semi_approved"
  | "partially_approved"
  | "declined";

export interface DocumentAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  response_notes?: string | null;
  responded_by?: { id: string; name: string } | null;
  responded_at?: string | null;
}

export type ApprovalStepStatus =
  | "created"
  | "pending"
  | "approved"
  | "declined";

export interface ApprovalStepUser {
  id: string;
  name: string;
  email?: string;
}

export interface ApprovalStep {
  id: string;
  /** Raw action from the API `history` entry, e.g. "request_created", "workflow_step_pending". */
  action: string;
  /** Normalized status driving the step's icon/color. */
  status: ApprovalStepStatus;
  user: ApprovalStepUser[] | null;
  date: string;
  /** From history `metadata.decision_scope` when present (e.g. attachment_declined). */
  decisionScope?: "partial" | "full" | string | null;
}

export interface DocumentComment {
  id: string;
  user: string;
  avatar?: string;
  date: string;
  content: string;
}

export interface DocumentRowProject {
  id: string;
  name: string;
  serial_number?: string;
}

export interface DocumentRow {
  id: string;
  /** Request reference from API (`serial_number`). */
  serialNumber?: string;
  name: string;
  fileSize: string;
  documentCount: number;
  lastActivityUser: string;
  lastActivityDate: string;
  status: DocumentStatus;
  /**
   * Unified `projects/attachment-requests` list: incoming vs outgoing.
   * Omitted for legacy rows (e.g. mocks).
   */
  flow?: "incoming" | "outgoing";
  /** `sender_company.name` (fallback: created user name). */
  senderName?: string;
  /** `receiver_company.name` — shown under الجهة. */
  receiverName?: string;
  /** Present when the attachment-requests API embeds `project`. */
  project?: DocumentRowProject | null;
  documentType?: string;
  approvalStatus?: string;
  submissionDate?: string;
  description?: string;
  attachments?: DocumentAttachment[];
  approvalPath?: ApprovalStep[];
  comments?: DocumentComment[];
  canTakeAction?: boolean;
}
