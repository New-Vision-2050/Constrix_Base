import { useLocale } from "next-intl";
import { WorkPeriodConstraint } from "@/services/api/user-attendance";
import { formatCurrentTimeParts } from "./time";
import { formatFullDate, localizeWesternDigits } from "./i18n";
import {
  getShiftElapsedMinutes,
  getShiftRemainingMinutes,
  getShiftTotalMinutes,
} from "./time";

export function formatApiTime(time: string, locale: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  const parts = formatCurrentTimeParts(date, locale);
  const localizedTime = localizeWesternDigits(parts.time, locale);

  return {
    ...parts,
    display: parts.period ? `${localizedTime} ${parts.period}` : localizedTime,
  };
}

export function getLateMinutes(now: Date, startTime: string) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const start = new Date(now);
  start.setHours(hours, minutes, 0, 0);

  const diffMinutes = Math.floor((now.getTime() - start.getTime()) / 60_000);

  return Math.max(0, diffMinutes);
}

export function useFormattedNow(now: Date) {
  const locale = useLocale();

  return {
    timeParts: formatCurrentTimeParts(now, locale),
    fullDate: formatFullDate(now, locale),
  };
}

export function getActiveAttendance<
  T extends { status: string; clock_out_time: string | null },
>(attendance: T[] | undefined) {
  return attendance?.find(
    (record) => record.status === "active" && !record.clock_out_time,
  );
}

export function getActiveWorkPeriod<T extends { is_active: boolean }>(
  periods: T[] | undefined,
) {
  return periods?.find((period) => period.is_active);
}

export function toShiftPeriod(
  period: Pick<
    WorkPeriodConstraint,
    "start_time" | "end_time" | "extends_to_next_day"
  >,
) {
  const [startHours, startMinutes] = period.start_time.split(":").map(Number);
  const [endHours, endMinutes] = period.end_time.split(":").map(Number);

  return {
    startMinutes: startHours * 60 + startMinutes,
    endMinutes: endHours * 60 + endMinutes,
    endsNextDay: period.extends_to_next_day,
  };
}

export function getPeriodShiftProgress(
  now: Date,
  period: WorkPeriodConstraint,
) {
  const shift = toShiftPeriod(period);
  const totalMinutes = getShiftTotalMinutes(shift);
  const remainingMinutes = getShiftRemainingMinutes(now, shift);
  const elapsedMinutes = getShiftElapsedMinutes(now, shift);

  return {
    totalMinutes,
    remainingMinutes,
    elapsedMinutes,
    progress: totalMinutes > 0 ? elapsedMinutes / totalMinutes : 0,
  };
}

export function getAttendanceActionState(period?: WorkPeriodConstraint) {
  if (!period?.is_active) {
    return {
      showButton: false,
      isClockOut: false,
      canPerform: false,
    };
  }

  return {
    showButton: true,
    isClockOut: period.can_clock_out,
    canPerform: period.can_clock_in || period.can_clock_out,
  };
}

export function getEarlyClockInMinutes(
  rules?: WorkPeriodConstraint["early_clock_in_rules"],
) {
  if (!rules?.prevent_early_clock_in) return 0;

  if (rules.early_unit === "hour") {
    return rules.early_period * 60;
  }

  return rules.early_period;
}

export function isBeforeEarlyClockInWindow(
  now: Date,
  period: WorkPeriodConstraint,
) {
  const earlyMinutes = getEarlyClockInMinutes(period.early_clock_in_rules);
  if (!earlyMinutes) return false;

  const [hours, minutes] = period.start_time.split(":").map(Number);
  const earliestClockIn = new Date(now);
  earliestClockIn.setHours(hours, minutes - earlyMinutes, 0, 0);

  return now < earliestClockIn;
}

export function getLatestAttendanceRecord(period?: WorkPeriodConstraint) {
  if (!period?.attendance.length) return undefined;

  return period.attendance.at(-1);
}
