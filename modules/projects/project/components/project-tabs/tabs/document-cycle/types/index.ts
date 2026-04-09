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
}

export interface ApprovalStep {
  id: string;
  title: string;
  user: string;
  date: string;
  status: "pending" | "completed" | "current";
  icon?: "submit" | "review" | "technical" | "commercial";
}

export interface DocumentComment {
  id: string;
  user: string;
  avatar?: string;
  date: string;
  content: string;
}

/** Normalized attachment-request `history` entries for UI steppers. */
export interface DocumentHistoryEntry {
  id: string;
  action: string;
  description: string;
  userName: string;
  timestamp: string;
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
  /** Present when the attachment-requests API embeds `project`. */
  project?: DocumentRowProject | null;
  documentType?: string;
  approvalStatus?: string;
  submissionDate?: string;
  description?: string;
  attachments?: DocumentAttachment[];
  approvalPath?: ApprovalStep[];
  /** From API `history` on attachment requests (chronological). */
  history?: DocumentHistoryEntry[];
  comments?: DocumentComment[];
}
