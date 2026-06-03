import { hrReportsMessages } from "@/messages/groups/hr-reports";
import type { Locale, MessageItem, MessagesGroup } from "@/messages/types";
import type { AttendanceDataTypeId } from "./types";

function asGroup(
  v: MessagesGroup | MessageItem | undefined,
): MessagesGroup | undefined {
  if (
    v &&
    typeof v === "object" &&
    "get" in v &&
    typeof (v as MessagesGroup).get === "function"
  ) {
    return v as MessagesGroup;
  }
  return undefined;
}

function asItem(
  v: MessagesGroup | MessageItem | undefined,
): MessageItem | undefined {
  if (
    v &&
    typeof v === "object" &&
    "en" in v &&
    "ar" in v &&
    !("get" in v)
  ) {
    return v as MessageItem;
  }
  return undefined;
}

function attendanceDataTypesGroup(): MessagesGroup | undefined {
  const report = asGroup(hrReportsMessages.get("attendanceReport"));
  const wizard = report ? asGroup(report.get("wizard")) : undefined;
  const attendanceData = wizard
    ? asGroup(wizard.get("attendanceData"))
    : undefined;
  return attendanceData ? asGroup(attendanceData.get("dataTypes")) : undefined;
}

export function resolveWizardLocale(locale: string | undefined): Locale {
  const code = (locale ?? "en").split("-")[0]?.toLowerCase();
  return code === "ar" ? "ar" : "en";
}

export function attendanceDataTypeLabel(
  id: AttendanceDataTypeId,
  locale: Locale,
): string {
  const types = attendanceDataTypesGroup();
  const item = types ? asItem(types.get(id)) : undefined;
  return item?.[locale] ?? id;
}
