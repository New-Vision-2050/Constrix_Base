import type { EndTaskStatus } from "@/services/api/projects/notifications/types/response";

export const END_TASK_SCREENSHOT_SLOTS = 3;
export const END_TASK_SCREENSHOT_MAX_BYTES = 5 * 1024 * 1024;
export const END_TASK_NOTES_MAX_LENGTH = 500;

export function getEndTaskStatusLabel(
  status: EndTaskStatus,
  locale: string,
): string {
  return locale.startsWith("ar")
    ? status.name_ar
    : status.name_en || status.name_ar;
}

export function formatEndTaskDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}
