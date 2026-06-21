import {
  UserAttendanceCalendarDay,
  UserAttendanceCalendarSummary,
} from "@/services/api/user-attendance";
import { STATUS_HEX_COLORS } from "./status-colors";
import { CalendarCell } from "../types";

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
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatMonthYearFromParts(
  month: number,
  year: number,
  locale: string,
) {
  return formatMonthYear(new Date(year, month - 1, 1), locale);
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
];

export function shouldShowStatusLabel(statusKey?: string, hours?: string) {
  if (hours) return false;
  return statusKey === "off" || statusKey === "absent" || statusKey === "leave";
}

export function shouldShowHours(statusKey?: string, hours?: string) {
  return Boolean(hours && statusKey !== "off");
}
