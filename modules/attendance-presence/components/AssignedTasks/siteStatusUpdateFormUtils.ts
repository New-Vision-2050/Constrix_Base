import type { SiteStatusNotificationValue } from "@/services/api/projects/notifications/types/response";

export interface SiteStatusSelectField {
  keyId: string;
  options: string[];
  label: string;
}

export function getDefaultDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDefaultTimeValue(date = new Date()) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function getSiteStatusSelectFieldFromNotificationValues(
  notificationValues: SiteStatusNotificationValue[] | null | undefined,
): SiteStatusSelectField | null {
  const selectField = (notificationValues ?? []).find(
    (value) =>
      value.field_type === "select" &&
      value.show_in_site_status_updates !== false &&
      (value.options?.length ?? 0) > 0,
  );

  if (!selectField) return null;

  return {
    keyId: selectField.key_id,
    options: selectField.options ?? [],
    label:
      selectField.name_ar || selectField.name_en || selectField.key,
  };
}
