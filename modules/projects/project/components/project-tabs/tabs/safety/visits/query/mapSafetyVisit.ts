import type { SafetyVisitRow } from "../types";
import { buildViolationValues } from "../constants/safetyViolations";
import type {
  ProjectSafetyRecordDto,
  ProjectSafetyViolationEvidenceDto,
} from "@/services/api/projects/project-safety/types/response";

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

function resolveDate(value: string | null | undefined): string {
  const raw = value?.trim() ?? "";
  return raw.length >= 10 ? raw.slice(0, 10) : raw;
}

function resolveWorkOrderType(value: string | null | undefined): string {
  const raw = value?.trim() ?? "";
  if (!raw) return "";
  const normalized = raw.toLowerCase();
  if (normalized.includes("notification")) {
    return "اشعار طوارئ";
  }
  return raw;
}

function mapEvidence(dto: ProjectSafetyViolationEvidenceDto) {
  return {
    id: dto.id,
    name: pickString(dto.name),
    fileName: pickString(dto.file_name),
    mimeType: pickString(dto.mime_type),
    size: toNumber(dto.size),
    url: pickString(dto.url),
  };
}

export function mapSafetyVisitDto(
  dto: ProjectSafetyRecordDto,
): SafetyVisitRow {
  const violations = Array.isArray(dto.all_violations)
    ? dto.all_violations.map((violation) => ({
        id: String(violation.id),
        code: pickString(violation.code),
        description: pickString(violation.description),
        category: pickString(violation.category),
        isAttached: violation.is_attached === true,
        weight:
          violation.weight === null || violation.weight === undefined
            ? null
            : String(violation.weight),
        action: violation.action ?? null,
        evidence: Array.isArray(violation.evidence)
          ? violation.evidence.map(mapEvidence)
          : [],
        status:
          violation.status === null || violation.status === undefined
            ? null
            : toNumber(violation.status),
      }))
    : [];

  return {
    id: String(dto.id),
    workOrderNumber: pickString(
      dto.morphable?.display,
      dto["order_permit_num/notification_num"],
      dto.order_permit_num,
      dto.notification_num,
    ),
    workOrderType: resolveWorkOrderType(
      pickString(dto.morphable?.type, dto.order_type),
    ),
    date: resolveDate(dto.date),
    time: pickString(dto.time),
    requiredGrade: toNumber(dto.required_score),
    earnedGrade: toNumber(dto.earned_score),
    percentage: toNumber(dto.percentage),
    consultantEngineer: pickString(
      dto.assigned_user?.name,
      dto.consultant_engineer,
    ),
    consultant: pickString(dto.consultant),
    contractorId: pickString(dto.contractor_id),
    contractorName: pickString(dto.contractor_name),
    violations,
    violationValues: buildViolationValues(violations),
  };
}
