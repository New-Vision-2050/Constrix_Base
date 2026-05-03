import type { ReportWizardPayload } from "@/modules/hr-reports/attendance/components/report-wizard/types";

/** Normalized row from report list/detail APIs (`config` merged into wizard payload). */
export type CreatedAttendanceReport = {
  id: string;
  /** ISO timestamp from API or fallback when missing */
  createdAt: string;
  payload: ReportWizardPayload;
  /** Bilingual title from API `name` when the endpoint returns it */
  apiName?: { ar?: string; en?: string };
};

/** Saved template row for the wizard picker (same shape as list item after normalization). */
export type ReportTemplatePickRow = {
  id: string;
  apiName?: { ar?: string; en?: string };
  payload: ReportWizardPayload;
};

export type AttendanceReportsListRaw = unknown;
export type AttendanceReportDetailRaw = unknown;
export type AttendanceReportMutationRaw = unknown;
