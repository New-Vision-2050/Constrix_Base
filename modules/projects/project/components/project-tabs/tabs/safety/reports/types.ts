export type SafetyWeeklyReportStatus =
  | "ready"
  | "processing"
  | "failed"
  | "pending";

export type SafetyWeeklyReportRow = {
  id: string;
  serialNumber: string;
  title: string;
  reportTypes: string;
  fromDate: string;
  toDate: string;
  createdAt: string;
  status: SafetyWeeklyReportStatus;
  statusLabel?: string;
  downloadUrl: string;
};

export type SafetyWeeklyReportFilters = {
  fromDate: string;
  toDate: string;
};

export const EMPTY_SAFETY_WEEKLY_REPORT_FILTERS: SafetyWeeklyReportFilters = {
  fromDate: "",
  toDate: "",
};
