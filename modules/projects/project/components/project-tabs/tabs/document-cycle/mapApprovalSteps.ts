import type { AttachmentRequest } from "@/services/api/projects/attachment-requests/types/response";
import type { ApprovalStep, ApprovalStepStatus } from "./types";

function normalizeApprovalAction(action: string): string {
  return action.trim().toLowerCase().replace(/-/g, "_");
}

function approvalStepStatus(action: string): ApprovalStepStatus {
  switch (normalizeApprovalAction(action)) {
    case "request_created":
      return "created";
    case "workflow_step_approved":
    case "request_approved":
    case "request_fully_approved":
    case "attachment_approved":
      return "approved";
    case "workflow_step_rejected":
    case "request_declined":
    case "attachment_declined":
      return "declined";
    case "workflow_step_pending":
    default:
      return "pending";
  }
}

export function mapApprovalSteps(
  item: AttachmentRequest,
): ApprovalStep[] | undefined {
  const raw = item.history;
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  return raw.map((h) => ({
    id: h.id,
    action: h.action,
    status: approvalStepStatus(h.action),
    user: Array.isArray(h.user) ? h.user : null,
    date: h.timestamp ?? "",
  }));
}
