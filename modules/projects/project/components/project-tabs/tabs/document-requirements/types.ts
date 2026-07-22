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
