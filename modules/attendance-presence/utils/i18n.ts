import { UserAttendanceStatusKey } from "@/services/api/user-attendance";

const STATUS_TRANSLATION_KEYS: Record<UserAttendanceStatusKey, string> = {
  present: "present",
  absent: "absent",
  late: "late",
  leave: "leave",
  off: "holiday",
  required: "required",
};

export function getLocalizedStatusLabel(
  statusKey: UserAttendanceStatusKey,
  apiStatus: string,
  locale: string,
  translate: (key: string) => string,
) {
  if (locale === "ar") return apiStatus;

  const key = STATUS_TRANSLATION_KEYS[statusKey];
  return translate(key);
}

export function formatFullDate(date: Date, locale: string) {
  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return localizeWesternDigits(formatted, locale);
}

const EASTERN_ARABIC_DIGITS = [
  "٠",
  "١",
  "٢",
  "٣",
  "٤",
  "٥",
  "٦",
  "٧",
  "٨",
  "٩",
];

export function localizeWesternDigits(value: string, locale: string) {
  if (locale !== "ar") return value;

  return value.replace(/\d/g, (digit) => EASTERN_ARABIC_DIGITS[Number(digit)]);
}

export function formatLocalizedNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions,
) {
  const formatted = new Intl.NumberFormat(locale, options).format(value);

  return localizeWesternDigits(formatted, locale);
}

export function formatLocalizedValue(
  value: string | number,
  locale: string,
) {
  if (typeof value === "number") {
    return formatLocalizedNumber(value, locale);
  }

  return localizeWesternDigits(value, locale);
}

export function formatElapsedDurationLabel(
  totalMinutes: number,
  hoursShort: string,
) {
  const hours = Math.floor(Math.max(0, totalMinutes) / 60);
  const minutes = Math.max(0, totalMinutes) % 60;
  const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  return `${time} ${hoursShort}`;
}
