import type { RequirementUploadDisabledReason } from "../types";

export function getUploadDisabledReasonKey(
  reason: RequirementUploadDisabledReason,
): string | null {
  if (!reason) return null;
  switch (reason) {
    case "already_submitted":
    case "outside_repeat_days":
    case "missing_permission":
    case "not_assigned":
    case "invalid_repetition":
      return reason;
    default:
      return "unknown";
  }
}
