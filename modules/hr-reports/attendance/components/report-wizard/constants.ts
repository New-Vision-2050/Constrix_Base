/** Checkbox values for “نوع التقرير” — ids must match API `config.step1.reportTypeIds`. */
export const REPORT_TYPE_OPTIONS: {
  id: string;
  column: "a" | "b";
  disabled?: boolean;
}[] = [
  { id: "attendance_absence", column: "a" },
  { id: "leaves", column: "a" },
  { id: "overtime", column: "a" },
  { id: "monthly_performance", column: "a" },
  { id: "salaries", column: "b" },
  { id: "lateness", column: "b" },
  { id: "deductions", column: "b" },
  { id: "branches_comparison", column: "b" },
];
