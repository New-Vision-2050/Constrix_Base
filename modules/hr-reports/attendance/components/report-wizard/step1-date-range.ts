import type { ReportPeriodType } from "./types";

/** `YYYY-MM-DD` in local calendar (for `<input type="date">` and API). */
export function formatDateYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** First / last calendar day of the month containing `reference`. */
export function defaultCalendarMonthRange(
  reference: Date = new Date(),
): {
  dateFrom: string;
  dateTo: string;
  year: number;
  month: number;
} {
  const y = reference.getFullYear();
  const mo = reference.getMonth() + 1;
  const from = new Date(y, mo - 1, 1);
  const to = new Date(y, mo, 0);
  return {
    dateFrom: formatDateYYYYMMDD(from),
    dateTo: formatDateYYYYMMDD(to),
    year: y,
    month: mo,
  };
}

export function ensureOrderedRange(
  dateFrom: string,
  dateTo: string,
): { dateFrom: string; dateTo: string } {
  const a = dateFrom.trim();
  const b = dateTo.trim();
  if (!a || !b) return { dateFrom: a, dateTo: b };
  return a <= b ? { dateFrom: a, dateTo: b } : { dateFrom: b, dateTo: a };
}

type LegacyStep1Shape = {
  periodType: ReportPeriodType;
  year: number;
  month: number;
  week?: number | null;
  quarter?: number | null;
  dateFrom?: string;
  dateTo?: string;
};

/** Build an ordered `[from,to]` date range from wizard step1 (range or legacy period types). */
export function derivedDateRangeFromLegacyStep1(
  step1: LegacyStep1Shape,
): { dateFrom: string; dateTo: string } {
  const hasRangeDates =
    step1.periodType === "range" &&
    typeof step1.dateFrom === "string" &&
    typeof step1.dateTo === "string" &&
    step1.dateFrom.trim() !== "" &&
    step1.dateTo.trim() !== "";
  if (hasRangeDates) {
    return ensureOrderedRange(step1.dateFrom!.trim(), step1.dateTo!.trim());
  }

  const year = Number.isFinite(step1.year)
    ? step1.year
    : new Date().getFullYear();
  const month = Number.isFinite(step1.month)
    ? step1.month
    : new Date().getMonth() + 1;

  if (step1.periodType === "range") {
    return defaultCalendarMonthRange(new Date(year, month - 1, 1));
  }

  switch (step1.periodType) {
    case "yearly":
      return {
        dateFrom: formatDateYYYYMMDD(new Date(year, 0, 1)),
        dateTo: formatDateYYYYMMDD(new Date(year, 11, 31)),
      };
    case "quarterly": {
      const q = Math.min(
        4,
        Math.max(1, step1.quarter ?? Math.ceil(month / 3)),
      );
      const startMonth = (q - 1) * 3;
      return {
        dateFrom: formatDateYYYYMMDD(new Date(year, startMonth, 1)),
        dateTo: formatDateYYYYMMDD(new Date(year, startMonth + 3, 0)),
      };
    }
    case "monthly":
    case "weekly":
    default:
      return {
        dateFrom: formatDateYYYYMMDD(new Date(year, month - 1, 1)),
        dateTo: formatDateYYYYMMDD(new Date(year, month, 0)),
      };
  }
}
