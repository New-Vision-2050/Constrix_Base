import type { ReportTypeId } from "./types";

/** This attendance wizard only supports the attendance/absence report type. */
export const STEP1_ATTENDANCE_WIZARD_REPORT_TYPE_IDS: ReportTypeId[] = [
  "attendance_absence",
];

/** Checkbox values for “نوع التقرير” — ids must match API `config.step1.reportTypeIds`. */
export const REPORT_TYPE_OPTIONS: {
  id: string;
  column: "a" | "b";
  disabled?: boolean;
}[] = [
  { id: "attendance_absence", column: "a", disabled: true },
  { id: "leaves", column: "a", disabled: true },
  { id: "overtime", column: "a", disabled: true },
  { id: "monthly_performance", column: "a", disabled: true },
  { id: "salaries", column: "b", disabled: true },
  { id: "lateness", column: "b", disabled: true },
  { id: "deductions", column: "b", disabled: true },
  { id: "branches_comparison", column: "b", disabled: true },
];
