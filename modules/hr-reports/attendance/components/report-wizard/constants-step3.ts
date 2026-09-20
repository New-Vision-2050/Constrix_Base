import type { AttendanceDataTypeId, ReportDisplayModeId } from "./types";

export const DISPLAY_MODE_VALUES: ReportDisplayModeId[] = [
  "employee_per_page",
  "by_day",
];

/** Always included in reports; shown checked and disabled in the wizard. */
export const REQUIRED_ATTENDANCE_DATA_TYPE_IDS: AttendanceDataTypeId[] = [
  "name",
  "employee_status",
  "date",
];

/**
 * Columns removed from the detailed attendance PDF table as of Sep 2026.
 * They are no longer selectable in the wizard and are stripped from persisted
 * payloads / legacy lookups before the API call is built.
 */
export const REMOVED_ATTENDANCE_DATA_TYPE_IDS: AttendanceDataTypeId[] = [
  "branch",
  "management",
  "official_in",
  "official_out",
  "clock_in_location",
  "clock_out_location",
];

/** Section 1 — two columns (RTL: column “a” renders first in DOM ≈ visual right). */
export const ATTENDANCE_DATA_TYPE_OPTIONS: {
  id: AttendanceDataTypeId;
  column: "a" | "b";
}[] = [
  { id: "day", column: "a" },
  { id: "actual_in", column: "a" },
  { id: "actual_out", column: "b" },
  { id: "delay", column: "b" },
  { id: "overtime", column: "b" },
  { id: "total_hours", column: "b" },
  { id: "clock_out_cause", column: "b" },
];

export const STEP3_ALL_ATTENDANCE_DATA_TYPE_IDS: AttendanceDataTypeId[] = [
  ...REQUIRED_ATTENDANCE_DATA_TYPE_IDS,
  ...ATTENDANCE_DATA_TYPE_OPTIONS.map((o) => o.id),
];

/** Optional step-3 ids only — excludes always-on columns (not sent in API payload). */
export function selectableAttendanceDataTypeIds(
  ids: AttendanceDataTypeId[],
): AttendanceDataTypeId[] {
  const excluded = new Set([
    ...REQUIRED_ATTENDANCE_DATA_TYPE_IDS,
    ...REMOVED_ATTENDANCE_DATA_TYPE_IDS,
  ]);
  return ids.filter((id) => !excluded.has(id));
}

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
