import type { VisualElementId } from "./types";

/** Backend `SORT_BY_*`. */
export const STEP5_MAIN_SORT_VALUES = [
  "employee_name_alpha",
  "employee_code",
  "department",
  "branch",
  "job_title",
  "hire_date",
] as const;

export const STEP5_SORT_DIRECTION_VALUES = ["asc", "desc"] as const;

/** Backend `GROUP_BY_*`. */
export const STEP5_GROUP_BY_VALUES = [
  "none",
  "branch",
  "department",
  "management",
  "job_title",
] as const;

export const STEP5_EMPLOYEES_PER_PAGE_VALUES = [
  "10",
  "25",
  "50",
  "100",
] as const;

/** Backend `VISUAL_*` — column layout for the wizard grid only. */
export const VISUAL_ELEMENT_OPTIONS: {
  id: VisualElementId;
  column: "a" | "b";
}[] = [
  { id: "attendance_pct_chart", column: "a" },
  { id: "weekly_delays_chart", column: "a" },
  { id: "executive_summary_table", column: "a" },
  { id: "salary_distribution_chart", column: "b" },
  { id: "branch_comparison_chart", column: "b" },
  { id: "attendance_heatmap", column: "b" },
];
