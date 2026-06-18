import { useLocale } from "next-intl";
import { formatCurrentTimeParts } from "./time";
import { formatFullDate } from "./i18n";

export function formatApiTime(time: string, locale: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  const parts = formatCurrentTimeParts(date, locale);

  return {
    ...parts,
    display: parts.period ? `${parts.time} ${parts.period}` : parts.time,
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

export function getActiveWorkPeriod<
  T extends { is_active: boolean },
>(periods: T[] | undefined) {
  return periods?.find((period) => period.is_active);
}
