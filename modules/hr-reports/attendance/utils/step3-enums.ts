import {
  STEP3_DELAY_VALUES,
  STEP3_OVERTIME_VALUES,
  STEP3_PATTERN_VALUES,
  STEP3_RATE_MIN_VALUES,
} from "../components/report-wizard/constants-step3";
import type {
  AttendancePatternId,
  AttendanceRateMinId,
  DelayLimitMinutesId,
  MinOvertimeId,
  ReportWizardPayload,
} from "../components/report-wizard/types";

const LEGACY_RATE: Record<string, AttendanceRateMinId> = {
  min_50: "fifty",
  min_80: "ninety",
  min_95: "ninety",
  sixty: "seventy",
  eighty: "ninety",
  ninety_five: "ninety",
};

const PATTERN_SET = new Set<string>(STEP3_PATTERN_VALUES);
const RATE_SET = new Set<string>(STEP3_RATE_MIN_VALUES);
const DELAY_SET = new Set<string>(STEP3_DELAY_VALUES);
const OT_SET = new Set<string>(STEP3_OVERTIME_VALUES);

/** Coerce step3 string enums to backend-allowed values (wizard + legacy API configs). */
export function normalizeStep3EnumFields(
  step3: ReportWizardPayload["step3"],
): ReportWizardPayload["step3"] {
  let rate = String(step3.attendanceRateMin ?? "no_filter");
  rate = LEGACY_RATE[rate] ?? rate;
  const attendanceRateMin = (
    RATE_SET.has(rate) ? rate : "no_filter"
  ) as AttendanceRateMinId;

  let delay =
    step3.delayLimitMinutes === "none"
      ? "no_filter"
      : step3.delayLimitMinutes;
  const delayLimitMinutes = (
    DELAY_SET.has(delay) ? delay : "no_filter"
  ) as DelayLimitMinutesId;

  let ot =
    step3.minOvertime === "none" ? "no_filter" : step3.minOvertime;
  const minOvertime = (OT_SET.has(ot) ? ot : "no_filter") as MinOvertimeId;

  const pattern = String(step3.attendancePattern ?? "all");
  const attendancePattern = (
    PATTERN_SET.has(pattern) ? pattern : "all"
  ) as AttendancePatternId;

  return {
    ...step3,
    attendancePattern,
    attendanceRateMin,
    delayLimitMinutes,
    minOvertime,
  };
}
