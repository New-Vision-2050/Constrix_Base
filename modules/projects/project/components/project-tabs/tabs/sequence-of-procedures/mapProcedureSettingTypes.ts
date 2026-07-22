import type { ProcedureSettingTypeDto } from "@/services/api/crm-settings/procedure-settings/types/response";
import type { ProceduresSettingsOuterTab } from "@/modules/hr-settings/tabs/procedures-settings";

/** Known CRM/HR domains — exclude when listing document-sequence tabs. */
const NON_DOCUMENT_PROCEDURE_TYPES = new Set([
  "client_request",
  "contract",
  "price_offer",
  "meeting",
  "employee_task",
  "project_notification_task",
]);

function toCamelCaseKey(type: string): string {
  return type.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

function resolveTypeKey(item: ProcedureSettingTypeDto): string {
  return String(item.type ?? item.key ?? item.slug ?? "")
    .trim()
    .toLowerCase();
}

function resolveLabel(
  item: ProcedureSettingTypeDto,
  locale: string,
): string | undefined {
  const labelAr = item.label_ar ?? item.name_ar ?? item.name ?? item.label;
  const labelEn = item.label_en ?? item.name_en ?? item.name ?? item.label;
  const label = locale === "ar" ? labelAr ?? labelEn : labelEn ?? labelAr;
  const trimmed = label?.trim();
  return trimmed || undefined;
}

function isDocumentProcedureType(item: ProcedureSettingTypeDto): boolean {
  const group = String(
    item.group ?? item.category ?? item.module ?? "",
  ).toLowerCase();
  if (
    group.includes("document") ||
    group.includes("attachment") ||
    group === "doc"
  ) {
    return true;
  }
  if (group.includes("crm") || group.includes("hr")) {
    return false;
  }
  const type = resolveTypeKey(item);
  return !!type && !NON_DOCUMENT_PROCEDURE_TYPES.has(type);
}

export function mapProcedureSettingTypesToOuterTabs(
  items: ProcedureSettingTypeDto[],
  locale: string,
): ProceduresSettingsOuterTab[] {
  const documentItems = items.filter(isDocumentProcedureType);

  return documentItems
    .map((item, index) => {
      const type = resolveTypeKey(item);
      if (!type) return null;

      const numericId =
        typeof item.id === "number"
          ? item.id
          : Number.parseInt(String(item.id ?? ""), 10);

      return {
        id: Number.isFinite(numericId) ? numericId : index,
        type,
        name: toCamelCaseKey(type),
        label: resolveLabel(item, locale),
      } satisfies ProceduresSettingsOuterTab;
    })
    .filter((tab): tab is ProceduresSettingsOuterTab => tab != null);
}
