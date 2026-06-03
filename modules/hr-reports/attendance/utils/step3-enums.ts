import {
  STEP3_ALL_ATTENDANCE_DATA_TYPE_IDS,
} from "../components/report-wizard/constants-step3";
import type {
  AttendanceDataTypeId,
  ReportDisplayModeId,
  ReportWizardPayload,
} from "../components/report-wizard/types";

const VALID_ATTENDANCE_DATA_TYPE_IDS = new Set<AttendanceDataTypeId>(
  STEP3_ALL_ATTENDANCE_DATA_TYPE_IDS,
);

/** Maps removed wizard metric ids to the new column ids. */
const LEGACY_ATTENDANCE_DATA_TYPE_IDS: Record<string, AttendanceDataTypeId> = {
  attendance_days: "day",
  absence_days: "day",
  delays: "delay",
  overtime: "overtime",
  early_departure: "actual_out",
};

function coerceBool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function normalizeAttendanceDataTypeIds(
  raw: unknown,
): AttendanceDataTypeId[] {
  if (!Array.isArray(raw)) {
    return [...STEP3_ALL_ATTENDANCE_DATA_TYPE_IDS];
  }

  const out: AttendanceDataTypeId[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const mapped =
      LEGACY_ATTENDANCE_DATA_TYPE_IDS[item] ?? (item as AttendanceDataTypeId);
    if (!VALID_ATTENDANCE_DATA_TYPE_IDS.has(mapped) || out.includes(mapped)) {
      continue;
    }
    out.push(mapped);
  }

  return out.length ? out : [...STEP3_ALL_ATTENDANCE_DATA_TYPE_IDS];
}

/**
 * Canonical step 3 wizard state (fixes lists, parses `displayMode` /
 * snake_case `display_mode`, ignores removed pattern/rate fields from legacy payloads).
 */
export function normalizeStep3EnumFields(
  raw:
    | ReportWizardPayload["step3"]
    | (Partial<ReportWizardPayload["step3"]> & Record<string, unknown>),
): ReportWizardPayload["step3"] {
  const dmUnknown = raw.displayMode ?? raw.display_mode;
  const displayMode: ReportDisplayModeId =
    dmUnknown === "by_day" ? "by_day" : "employee_per_page";

  return {
    attendanceDataTypeIds: normalizeAttendanceDataTypeIds(
      raw.attendanceDataTypeIds,
    ),
    displayMode,
    includeEntryExitTime: coerceBool(raw.includeEntryExitTime, true),
    includeShiftName: coerceBool(raw.includeShiftName, true),
    includeAttendanceNotes: coerceBool(raw.includeAttendanceNotes, true),
    calculateTotalWorkHours: coerceBool(raw.calculateTotalWorkHours, true),
    showPreviousMonthComparison: coerceBool(
      raw.showPreviousMonthComparison,
      true,
    ),
  };
}
