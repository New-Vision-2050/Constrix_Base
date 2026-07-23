import type { SafetyReportRow } from "@/modules/projects/project/components/project-tabs/tabs/safety/safety-report-types";
import type { ProjectSafetyReportDto } from "@/services/api/projects/project-safety/types/report-response";

function pickString(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

function toNumber(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
}

function normalizeStatus(
  value: string | null | undefined,
): SafetyReportRow["orderStatus"] {
  const normalized = value?.trim().toLowerCase() ?? "";
  if (
    normalized.includes("complete") ||
    normalized.includes("مكتمل")
  ) {
    return "completed";
  }
  if (
    normalized.includes("late") ||
    normalized.includes("delay") ||
    normalized.includes("متأخر")
  ) {
    return "late";
  }
  return "in_progress";
}

export function mapProjectSafetyReportDto(
  dto: ProjectSafetyReportDto,
): SafetyReportRow {
  return {
    id: String(dto.id),
    orderNumber: pickString(
      dto.order_number,
      dto["order_permit_num/notification_num"],
      dto.order_permit_num,
      dto.notification_num,
    ),
    orderStatus: normalizeStatus(
      pickString(dto.order_status, dto.status),
    ),
    orderStatusLabel: pickString(dto.order_status_label, dto.status_label) || undefined,
    safetyVisitsCount: toNumber(
      dto.safety_visits_count ?? dto.visits_count,
    ),
    observationsCount: toNumber(
      dto.observations_count ?? dto.notes_count,
    ),
    siteVisitFormsCount: toNumber(
      dto.site_visit_forms_count ?? dto.forms_count,
    ),
    contractorName: pickString(
      dto.contractor_name,
      dto.contractor,
    ),
    consultantName: pickString(
      dto.consultant_name,
      dto.consultant,
    ),
    engineerName: pickString(
      dto.engineer_name,
      dto.consultant_engineer,
      dto.engineer,
    ),
  };
}
