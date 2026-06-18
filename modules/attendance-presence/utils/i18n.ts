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
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
