import { WorkPeriod } from "../types";
import { localizeWesternDigits } from "./i18n";

export function formatCurrentTime(date: Date, locale: string) {
  const formatted = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return localizeWesternDigits(formatted, locale);
}

export function formatCurrentTimeParts(date: Date, locale: string) {
  const parts = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  const dayPeriod = parts.find((part) => part.type === "dayPeriod")?.value ?? "";

  return {
    time: localizeWesternDigits(`${hour}:${minute}`, locale),
    period: dayPeriod,
  };
}

export function formatDurationHoursMinutes(totalMinutes: number) {
  const safeMinutes = Math.max(0, totalMinutes);
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function splitDecimalHours(totalHours: number) {
  const safeHours = Math.max(0, totalHours);
  const hours = Math.floor(safeHours);
  const minutes = Math.round((safeHours - hours) * 60);

  return { hours, minutes };
}

export function parseDurationFormatted(value: string | null | undefined) {
  if (!value) return 0;

  const match = value.match(/(\d+)h\s*(\d+)m/i);
  if (!match) return 0;

  return Number.parseInt(match[1], 10) * 60 + Number.parseInt(match[2], 10);
}

function getMinutesFromDate(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

export function getShiftRemainingMinutes(
  now: Date,
  period: Pick<WorkPeriod, "startMinutes" | "endMinutes" | "endsNextDay">,
) {
  const nowMinutes = getMinutesFromDate(now);
  const { startMinutes, endMinutes, endsNextDay } = period;

  if (endsNextDay) {
    if (nowMinutes >= startMinutes) {
      return 24 * 60 - nowMinutes + endMinutes;
    }

    if (nowMinutes < endMinutes) {
      return endMinutes - nowMinutes;
    }

    return 0;
  }

  if (nowMinutes < startMinutes || nowMinutes >= endMinutes) {
    return 0;
  }

  return endMinutes - nowMinutes;
}

export function getShiftElapsedMinutes(
  now: Date,
  period: Pick<WorkPeriod, "startMinutes" | "endMinutes" | "endsNextDay">,
) {
  const nowMinutes = getMinutesFromDate(now);
  const { startMinutes, endMinutes, endsNextDay } = period;

  if (endsNextDay) {
    if (nowMinutes >= startMinutes) {
      return nowMinutes - startMinutes;
    }

    if (nowMinutes < endMinutes) {
      return 24 * 60 - startMinutes + nowMinutes;
    }

    return 0;
  }

  if (nowMinutes < startMinutes || nowMinutes >= endMinutes) {
    return 0;
  }

  return nowMinutes - startMinutes;
}

export function getShiftTotalMinutes(
  period: Pick<WorkPeriod, "startMinutes" | "endMinutes" | "endsNextDay">,
) {
  if (period.endsNextDay) {
    return 24 * 60 - period.startMinutes + period.endMinutes;
  }

  return period.endMinutes - period.startMinutes;
}
