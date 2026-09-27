const MONTH_DAY_PATTERN = /^(\d{2})-(\d{2})$/;
const ISO_DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})/;
const MS_PER_DAY = 86_400_000;

/** Convert a picker/ISO/full date to API `MM-DD`. */
export function toMonthDay(value?: string | null): string | null {
  if (value == null || value === "") return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${month}-${day}`;
  }

  const trimmed = String(value).trim();
  if (MONTH_DAY_PATTERN.test(trimmed)) return trimmed;

  const iso = trimmed.match(ISO_DATE_PREFIX);
  if (iso) return `${iso[2]}-${iso[3]}`;

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

/** Read calendar year from ISO/picker values when present. */
export function extractYearFromDateValue(
  value?: string | null
): number | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.getFullYear();
  }
  const trimmed = String(value).trim();
  const iso = trimmed.match(ISO_DATE_PREFIX);
  if (!iso) return null;
  const year = Number(iso[1]);
  return Number.isFinite(year) ? year : null;
}

/** Build a date-picker value from API `MM-DD` and a year. */
export function monthDayToPickerDate(
  monthDay?: string | null,
  year?: number | string | null
): string {
  if (!monthDay) return "";
  const boundYear = Number(year) || new Date().getFullYear();
  const mmdd = toMonthDay(monthDay);
  if (!mmdd) return String(monthDay);
  return `${boundYear}-${mmdd}T00:00:00.000Z`;
}

/**
 * Inclusive day count between holiday start/end.
 * Same calendar day (MM-DD) always counts as 1 day.
 * Supports ranges within a year and ranges that cross into the next year (e.g. Dec 31 → Jan 2).
 */
export function countHolidayDays(
  dateStart?: string | null,
  dateEnd?: string | null,
  year?: number | string | null
): number | null {
  const startMd = toMonthDay(dateStart);
  const endMd = toMonthDay(dateEnd);
  if (!startMd || !endMd) return null;

  if (startMd === endMd) return 1;

  const anchorYear =
    extractYearFromDateValue(dateStart) ??
    extractYearFromDateValue(dateEnd) ??
    (Number(year) || new Date().getFullYear());

  const [sm, sd] = startMd.split("-").map(Number);
  const [em, ed] = endMd.split("-").map(Number);
  if (
    !Number.isFinite(sm) ||
    !Number.isFinite(sd) ||
    !Number.isFinite(em) ||
    !Number.isFinite(ed)
  ) {
    return null;
  }

  const startMs = Date.UTC(anchorYear, sm - 1, sd);
  let endMs = Date.UTC(anchorYear, em - 1, ed);

  if (endMs < startMs) {
    endMs = Date.UTC(anchorYear + 1, em - 1, ed);
  }

  const diffDays = Math.floor((endMs - startMs) / MS_PER_DAY);
  if (diffDays < 0) return null;

  return diffDays + 1;
}

export function toBranchId(value?: string | number | null): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
