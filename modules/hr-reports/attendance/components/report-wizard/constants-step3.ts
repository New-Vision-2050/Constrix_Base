import type { AttendanceDataTypeId } from "./types";

/** Section 1 — two columns (RTL: column “a” renders first in DOM ≈ visual right). */
export const ATTENDANCE_DATA_TYPE_OPTIONS: {
  id: AttendanceDataTypeId;
  column: "a" | "b";
}[] = [
  { id: "attendance_days", column: "a" },
  { id: "delays", column: "a" },
  { id: "taken_leaves", column: "a" },
  { id: "unpaid_leave", column: "a" },
  { id: "absence_days", column: "b" },
  { id: "overtime", column: "b" },
  { id: "sick_leaves", column: "b" },
  { id: "early_departure", column: "b" },
];

/** Backend `ATT_PATTERN_*`. */
export const STEP3_PATTERN_VALUES = [
  "all",
  "absentees_only",
  "late_only",
  "overtime_only",
  "present_only",
] as const;

/** Backend `ATT_RATE_*`. */
export const STEP3_RATE_MIN_VALUES = [
  "no_filter",
  "fifty",
  "seventy",
  "ninety",
] as const;

/** Backend `DELAY_*`. */
export const STEP3_DELAY_VALUES = [
  "no_filter",
  "five_min_or_more",
  "fifteen_min_or_more",
  "thirty_min_or_more",
  "sixty_min_or_more",
] as const;

/** Backend `OT_*`. */
export const STEP3_OVERTIME_VALUES = [
  "no_filter",
  "half_hour_or_more",
  "one_hour_or_more",
  "two_hours_or_more",
  "four_hours_or_more",
] as const;
