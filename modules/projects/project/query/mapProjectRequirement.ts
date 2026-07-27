import type { ProjectRequirementDto } from "@/services/api/projects/project-requirements/types/response";
import type {
  DocumentRequirementRow,
  DocumentRequirementSubmissionStatus,
  RequirementUploadStatus,
} from "@/modules/projects/project/components/project-tabs/tabs/document-requirements/types";

function mapEvaluationStatus(
  status: string | null | undefined,
): DocumentRequirementSubmissionStatus {
  switch ((status ?? "").toLowerCase()) {
    case "pending_acceptance":
    case "awaiting_acceptance":
      return "awaiting_acceptance";
    case "under_review":
      return "under_review";
    case "in_progress":
      return "in_progress";
    case "rejected":
      return "rejected";
    case "accepted":
      return "accepted";
    case "certified":
      return "certified";
    default:
      return "awaiting_acceptance";
  }
}

function formatFrequency(item: ProjectRequirementDto): string {
  const repetition = (item.repetition ?? "").toLowerCase();
  const days = Array.isArray(item.repeat_days)
    ? item.repeat_days.filter(Boolean).join(", ")
    : "";

  if (repetition === "once") return "once";
  if (days) return `${repetition || "—"} (${days})`;
  if (repetition) return repetition;
  return "—";
}

function toPercent(value: number | string | null | undefined): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function mapUploadStatus(
  item: ProjectRequirementDto,
): RequirementUploadStatus {
  const status = item.upload_status;
  const latest = status?.latest_submission;

  return {
    canUpload: Boolean(status?.can_upload),
    disabledReason: status?.disabled_reason ?? null,
    currentPeriodKey: status?.current_period_key ?? undefined,
    periodStartsAt: status?.period_starts_at ?? undefined,
    periodEndsAt: status?.period_ends_at ?? undefined,
    nextAvailableAt: status?.next_available_at ?? undefined,
    latestSubmission: latest
      ? {
          id: String(latest.id),
          submittedAt: latest.submitted_at ?? undefined,
          files: (latest.files ?? []).map((file) => ({
            id: String(file.id),
            name:
              file.file_name?.trim() ||
              file.name?.trim() ||
              String(file.id),
            url: file.url ?? undefined,
          })),
        }
      : null,
  };
}

export function mapProjectRequirementDto(
  item: ProjectRequirementDto,
): DocumentRequirementRow {
  return {
    id: String(item.id),
    requirementCode: item.requirement_code?.trim() || "—",
    requiredDocumentName: item.required_document_name?.trim() || "—",
    document: item.document?.trim() || "—",
    documentType: item.document_type?.trim() || "—",
    specialization: item.specialization?.trim() || "—",
    phase: item.stage?.trim() || "—",
    sendingEntity: item.sending_entity?.trim() || "—",
    reviewingEntity: item.review_entity?.trim() || "—",
    frequency: formatFrequency(item),
    submissionStatus: mapEvaluationStatus(item.evaluation_status),
    linkedDocument: item.resulting_document?.trim() || "—",
    completionPercent: toPercent(item.completion_percentage),
    uploadStatus: mapUploadStatus(item),
  };
}
