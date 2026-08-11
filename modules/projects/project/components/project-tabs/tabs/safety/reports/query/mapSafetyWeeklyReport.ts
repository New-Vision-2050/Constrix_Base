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

function toNumber(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
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
  const fromDate = pickString(dto.from_date);
  const toDate = pickString(dto.to_date);
  const statusRaw = pickString(dto.status);
  const downloadUrl = pickString(
    dto.download_url,
    dto.file_url,
    dto.report_url,
    dto.url,
  );

  return {
    id: pickString(dto.id) || `weekly-report-${index}`,
    serialNumber: pickString(dto.serial_number) || String(index + 1),
    name:
      pickString(dto.name, dto.title) ||
      (fromDate && toDate ? `${fromDate} → ${toDate}` : `Report ${index + 1}`),
    fromDate,
    toDate,
    status: normalizeStatus(statusRaw),
    statusLabel: statusRaw || undefined,
    createdAt: pickString(dto.created_at),
    generatedAt: pickString(dto.generated_at, dto.created_at),
    downloadUrl,
    hasFile: Boolean(dto.has_file ?? downloadUrl),
    fileSize: toNumber(dto.file_size),
  };
}
