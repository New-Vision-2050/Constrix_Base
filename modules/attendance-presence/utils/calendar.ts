import {
  UserAttendanceCalendarDay,
  UserAttendanceCalendarSummary,
} from "@/services/api/user-attendance";
import { STATUS_HEX_COLORS } from "./status-colors";
import { CalendarCell } from "../types";
import { localizeWesternDigits } from "./i18n";

export function buildCalendarGrid(
  days: UserAttendanceCalendarDay[],
  referenceDate = new Date(),
): CalendarCell[] {
  if (!days.length) return [];

  const firstDate = new Date(days[0].date);
  const leadingBlanks = firstDate.getDay();
  const cells: CalendarCell[] = [];

  for (let i = 0; i < leadingBlanks; i += 1) {
    cells.push({ date: null });
  }

  const today = referenceDate.toISOString().slice(0, 10);

  days.forEach((day) => {
    cells.push({
      date: day.day_number,
      isoDate: day.date,
      statusKey: day.status_key,
      statusLabel: day.status,
      hours: day.duration_formatted ?? undefined,
      dotColor: day.dot_color,
      isToday: day.date === today,
    });
  });

  return cells;
}

export function formatMonthYear(date: Date, locale: string) {
  const formatted = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);

  return localizeWesternDigits(formatted, locale);
}

export function formatMonthYearFromParts(
  month: number,
  year: number,
  locale: string,
) {
  return formatMonthYear(new Date(year, month - 1, 1), locale);
}

export function buildYearOptions(selectedYear: number) {
  const currentYear = new Date().getFullYear();
  const startYear = Math.min(currentYear - 25, selectedYear - 8);
  const endYear = Math.max(currentYear + 10, selectedYear + 8);
  const years: number[] = [];

  for (let year = endYear; year >= startYear; year -= 1) {
    years.push(year);
  }

  return years;
}

export function getLocalizedMonthNames(locale: string, style: "long" | "short" = "short") {
  return Array.from({ length: 12 }, (_, monthIndex) =>
    new Intl.DateTimeFormat(locale, { month: style }).format(
      new Date(2000, monthIndex, 1),
    ),
  );
}

export interface SummaryLegendItem {
  key: keyof UserAttendanceCalendarSummary;
  dotColor: string;
  labelKey: string;
}

export const SUMMARY_LEGEND_ITEMS: SummaryLegendItem[] = [
  { key: "present_count", dotColor: STATUS_HEX_COLORS.present, labelKey: "present" },
  { key: "absent_count", dotColor: STATUS_HEX_COLORS.absent, labelKey: "absent" },
  { key: "leave_count", dotColor: STATUS_HEX_COLORS.leave, labelKey: "leave" },
  { key: "off_count", dotColor: STATUS_HEX_COLORS.off, labelKey: "holiday" },
  { key: "late_count", dotColor: STATUS_HEX_COLORS.late, labelKey: "late" },
];

export const MONTH_SUMMARY_ITEMS: SummaryLegendItem[] = [
  { key: "present_count", dotColor: STATUS_HEX_COLORS.present, labelKey: "present" },
  { key: "off_count", dotColor: STATUS_HEX_COLORS.off, labelKey: "holiday" },
  { key: "leave_count", dotColor: STATUS_HEX_COLORS.leave, labelKey: "leave" },
  { key: "absent_count", dotColor: STATUS_HEX_COLORS.absent, labelKey: "absent" },
  { key: "late_count", dotColor: STATUS_HEX_COLORS.late, labelKey: "late" },
];

export const CALENDAR_LEGEND_ITEMS: SummaryLegendItem[] = [
  { key: "late_count", dotColor: STATUS_HEX_COLORS.late, labelKey: "late" },
  { key: "absent_count", dotColor: STATUS_HEX_COLORS.absent, labelKey: "absent" },
  { key: "off_count", dotColor: STATUS_HEX_COLORS.off, labelKey: "holiday" },
  {
    key: "required_count",
    dotColor: STATUS_HEX_COLORS.required,
    labelKey: "required",
  },
  {
    key: "on_task_count",
    dotColor: STATUS_HEX_COLORS.on_task,
    labelKey: "onTask",
  },
];

export function shouldShowStatusLabel(statusKey?: string, hours?: string) {
  // Show the API status label for any day that has no work hours,
  // so newly added statuses render dynamically without code changes.
  return !hours;
}

export function shouldShowHours(statusKey?: string, hours?: string) {
  return Boolean(hours && statusKey !== "off");
}

export interface CalendarLegendEntry {
  statusKey: string;
  statusLabel: string;
  dotColor: string;
}

/** Build the calendar footer legend from the statuses present in the response. */
export function buildCalendarLegend(
  days: UserAttendanceCalendarDay[],
): CalendarLegendEntry[] {
  const seen = new Map<string, CalendarLegendEntry>();

  days.forEach((day) => {
    if (!day.status_key || seen.has(day.status_key)) return;
    seen.set(day.status_key, {
      statusKey: day.status_key,
      statusLabel: day.status,
      dotColor: day.dot_color,
    });
  });

  return Array.from(seen.values());
}
