import type { SafetyReportRow } from "../types";
import type { ProjectSafetyReportDto } from "@/services/api/projects/project-safety/types/response";

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
): SafetyReportRow["status"] {
  const normalized = value?.trim().toLowerCase() ?? "";

  if (
    normalized.includes("complete") ||
    normalized.includes("مكتمل")
  ) {
    return "completed";
  }

  if (normalized.includes("pending") || normalized.includes("انتظار")) {
    return "pending";
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

function buildReportId(dto: ProjectSafetyReportDto): string {
  const morphableType = pickString(dto.morphable_type);
  const morphableId = pickString(dto.morphable_id);
  if (morphableType && morphableId) {
    return `${morphableType}:${morphableId}`;
  }
  return morphableId || morphableType || pickString(dto.morphable_display);
}

export function mapSafetyReportDto(
  dto: ProjectSafetyReportDto,
): SafetyReportRow {
  const statusRaw = pickString(dto.status);

  return {
    id: buildReportId(dto),
    morphableType: pickString(dto.morphable_type),
    morphableId: pickString(dto.morphable_id),
    morphableDisplay: pickString(dto.morphable_display),
    contractorId: pickString(dto.contractor_id),
    contractorName: pickString(dto.contractor_name),
    consultantEngineer: pickString(dto.consultant_engineer),
    consultant: pickString(dto.consultant),
    totalAssignments: toNumber(dto.total_assignments),
    completedCount: toNumber(dto.completed_count),
    pendingCount: toNumber(dto.pending_count),
    status: normalizeStatus(statusRaw),
    statusLabel: statusRaw || undefined,
  };
}
