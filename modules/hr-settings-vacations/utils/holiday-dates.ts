const MONTH_DAY_PATTERN = /^(\d{2})-(\d{2})$/;

/** Convert a picker/ISO/full date to API `MM-DD`. */
export function toMonthDay(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (MONTH_DAY_PATTERN.test(trimmed)) return trimmed;

  const fullDate = trimmed.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (fullDate) return `${fullDate[2]}-${fullDate[3]}`;

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${month}-${day}`;
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

/** Inclusive day count between holiday start/end (handles ranges that cross a year). */
export function countHolidayDays(
  dateStart?: string | null,
  dateEnd?: string | null,
  year?: number | string | null
): number | null {
  const startMd = toMonthDay(dateStart);
  const endMd = toMonthDay(dateEnd);
  if (!startMd || !endMd) return null;

  const y = Number(year) || new Date().getFullYear();
  const [sm, sd] = startMd.split("-").map(Number);
  const [em, ed] = endMd.split("-").map(Number);

  const start = Date.UTC(y, sm - 1, sd);
  let end = Date.UTC(y, em - 1, ed);
  if (end < start) {
    end = Date.UTC(y + 1, em - 1, ed);
  }

  const dayMs = 24 * 60 * 60 * 1000;
  return Math.round((end - start) / dayMs) + 1;
}

export function toBranchId(value?: string | number | null): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
