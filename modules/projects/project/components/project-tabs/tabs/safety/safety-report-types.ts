export type SafetyReportStatus =
  | "in_progress"
  | "completed"
  | "pending"
  | "late";

export type SafetyReportRow = {
  id: string;
  morphableType: string;
  morphableId: string;
  morphableDisplay: string;
  contractorId: string;
  contractorName: string;
  consultantEngineer: string;
  consultant: string;
  totalAssignments: number;
  completedCount: number;
  pendingCount: number;
  status: SafetyReportStatus;
  statusLabel?: string;
};

export type SafetyReportFilters = {
  reference: string;
  contractor: string;
  consultant: string;
  engineer: string;
};

export const EMPTY_SAFETY_REPORT_FILTERS: SafetyReportFilters = {
  reference: "",
  contractor: "",
  consultant: "",
  engineer: "",
};
