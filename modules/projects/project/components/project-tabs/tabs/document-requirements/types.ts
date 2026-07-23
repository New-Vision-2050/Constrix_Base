export type DocumentRequirementSubmissionStatus =
  | "under_review"
  | "in_progress"
  | "awaiting_acceptance"
  | "rejected"
  | "accepted"
  | "certified";

export type DocumentRequirementStatKey =
  | "awaitingAcceptance"
  | "rejected"
  | "accepted"
  | "inProgress"
  | "certified";

export type RequirementUploadDisabledReason =
  | "already_submitted"
  | "outside_repeat_days"
  | "missing_permission"
  | "not_assigned"
  | "invalid_repetition"
  | string
  | null;

export interface RequirementSubmissionFilePreview {
  id: string;
  name: string;
  url?: string;
}

export interface RequirementLatestSubmissionPreview {
  id: string;
  submittedAt?: string;
  files: RequirementSubmissionFilePreview[];
}

export interface RequirementUploadStatus {
  canUpload: boolean;
  disabledReason: RequirementUploadDisabledReason;
  currentPeriodKey?: string;
  periodStartsAt?: string;
  periodEndsAt?: string;
  nextAvailableAt?: string;
  latestSubmission: RequirementLatestSubmissionPreview | null;
}

export interface DocumentRequirementRow {
  id: string;
  requirementCode: string;
  requiredDocumentName: string;
  document: string;
  documentType: string;
  specialization: string;
  phase: string;
  sendingEntity: string;
  reviewingEntity: string;
  frequency: string;
  submissionStatus: DocumentRequirementSubmissionStatus;
  linkedDocument: string;
  completionPercent: number;
  uploadStatus: RequirementUploadStatus;
}

export interface DocumentRequirementStat {
  key: DocumentRequirementStatKey;
  count: number;
  percent: number;
}

export type RequirementFrequencyType = "day" | "week" | "month";

export interface RequirementEntry {
  id: string;
  requirementCode: string;
  requiredDocumentName: string;
  document: string;
  documentType: string;
  specialization: string;
  frequencyType: RequirementFrequencyType | "";
  selectedDays: string[];
  interval: string;
}
