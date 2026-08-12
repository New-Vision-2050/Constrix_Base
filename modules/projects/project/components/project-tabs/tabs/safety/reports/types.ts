export type SafetyWeeklyReportStatus =
  | "ready"
  | "processing"
  | "failed"
  | "pending";

export type SafetyWeeklyReportRow = {
  id: string;
  serialNumber: string;
  name: string;
  fromDate: string;
  toDate: string;
  status: SafetyWeeklyReportStatus;
  statusLabel?: string;
  createdAt: string;
  generatedAt: string;
  downloadUrl: string;
  hasFile: boolean;
  fileSize: number;
};

export type SafetyWeeklyReportFilters = {
  fromDate: string;
  toDate: string;
};

export const EMPTY_SAFETY_WEEKLY_REPORT_FILTERS: SafetyWeeklyReportFilters = {
  fromDate: "",
  toDate: "",
};
