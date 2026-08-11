import type { ProjectSafetyWeeklyReportDto } from "@/services/api/projects/project-safety/types/response";
import type { SafetyWeeklyReportRow } from "../types";

function pickString(...values: Array<string | number | null | undefined>): string {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const trimmed = String(value).trim();
    if (trimmed) return trimmed;
  }
  return "";
}

function formatReportTypes(
  value: ProjectSafetyWeeklyReportDto["report_types"],
): string {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean).join(", ");
  }
  return pickString(value);
}

function normalizeStatus(
  value: string | null | undefined,
): SafetyWeeklyReportRow["status"] {
  const normalized = value?.trim().toLowerCase() ?? "";

  if (
    normalized.includes("fail") ||
    normalized.includes("error") ||
    normalized.includes("فشل")
  ) {
    return "failed";
  }

  if (
    normalized.includes("process") ||
    normalized.includes("generat") ||
    normalized.includes("progress") ||
    normalized.includes("قيد")
  ) {
    return "processing";
  }

  if (
    normalized.includes("ready") ||
    normalized.includes("complete") ||
    normalized.includes("done") ||
    normalized.includes("success") ||
    normalized.includes("جاهز") ||
    normalized.includes("مكتمل")
  ) {
    return "ready";
  }

  if (normalized.includes("pending") || normalized.includes("انتظار")) {
    return "pending";
  }

  return normalized ? "ready" : "pending";
}

export function mapSafetyWeeklyReportDto(
  dto: ProjectSafetyWeeklyReportDto,
  index: number,
): SafetyWeeklyReportRow {
  const fromDate = pickString(dto.from_date, dto.week_start);
  const toDate = pickString(dto.to_date, dto.week_end);
  const createdAt = pickString(dto.created_at, dto.generated_at, dto.updated_at);
  const statusRaw = pickString(dto.status);
  const title =
    pickString(dto.title, dto.name) ||
    (fromDate && toDate ? `${fromDate} → ${toDate}` : `Report ${index + 1}`);
  const reportTypes =
    formatReportTypes(dto.report_types) ||
    pickString(dto.report_type, dto.type) ||
    title;

  return {
    id: pickString(dto.id) || `weekly-report-${index}`,
    serialNumber: pickString(dto.serial_number, dto.id) || String(index + 1),
    title,
    reportTypes,
    fromDate,
    toDate,
    createdAt,
    status: normalizeStatus(statusRaw),
    statusLabel: statusRaw || undefined,
    downloadUrl: pickString(
      dto.download_url,
      dto.file_url,
      dto.report_url,
      dto.url,
    ),
  };
}
