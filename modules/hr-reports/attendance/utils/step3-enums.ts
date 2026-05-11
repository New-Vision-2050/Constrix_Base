import { STEP3_ALL_ATTENDANCE_DATA_TYPE_IDS } from "../components/report-wizard/constants-step3";
import type {
  ReportDisplayModeId,
  ReportWizardPayload,
} from "../components/report-wizard/types";

function coerceBool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
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
    attendanceDataTypeIds: [...STEP3_ALL_ATTENDANCE_DATA_TYPE_IDS],
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
