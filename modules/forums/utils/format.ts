/** Formatting helpers shared by the forums screens. */

const DATE_ONLY: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

const DATE_TIME: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  hour: "numeric",
  minute: "2-digit",
};

function format(
  value: string | null | undefined,
  locale: string,
  options: Intl.DateTimeFormatOptions,
) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    ...options,
    numberingSystem: locale === "ar" ? "arab" : "latn",
  }).format(date);
}

/** `19 نوفمبر 2026` */
export function formatDate(value: string | null | undefined, locale: string) {
  return format(value, locale, DATE_ONLY);
}

/** `19 نوفمبر، 9:35 ص` */
export function formatDateTime(
  value: string | null | undefined,
  locale: string,
) {
  return format(value, locale, DATE_TIME);
}

/** Locale-aware integer, so counters match the Arabic numerals in the design. */
export function formatNumber(value: number | undefined | null, locale: string) {
  const safe = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-GB").format(
    safe,
  );
}

/** `1.4 MB` */
export function formatFileSize(bytes: number | undefined | null) {
  if (!bytes || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** `0:24` */
export function formatDuration(seconds: number | undefined | null) {
  if (!seconds || seconds <= 0) return "";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}
