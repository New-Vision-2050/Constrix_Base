export type DocumentStatus =
  | "draft"
  | "pending"
  | "approved"
  | "semi_approved"
  | "partially_approved"
  | "rejected";

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

export interface DocumentRowProject {
  id: string;
  name: string;
  serial_number?: string;
}

export interface DocumentRow {
  id: string;
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
  comments?: DocumentComment[];
}
