import type { NotificationStatus, NotificationSeverity } from "@/services/api/projects/notifications/types/response";

export type StatusStyle = {
  labelKey: string;
  muiColor: "default" | "warning" | "success" | "info" | "error" | "primary";
};

export const STATUS_CONFIG: Record<NotificationStatus, StatusStyle> = {
  pending: { labelKey: "statuses.pending", muiColor: "warning" },
  approved: { labelKey: "statuses.approved", muiColor: "success" },
  rejected: { labelKey: "statuses.rejected", muiColor: "error" },
  in_progress: { labelKey: "statuses.inProgress", muiColor: "info" },
  completed: { labelKey: "statuses.completed", muiColor: "success" },
  cancelled: { labelKey: "statuses.cancelled", muiColor: "default" },
  draft: { labelKey: "statuses.draft", muiColor: "default" },
};

export type SeverityStyle = {
  labelKey: string;
  muiColor: "default" | "warning" | "success" | "info" | "error";
};

export const SEVERITY_CONFIG: Record<NotificationSeverity, SeverityStyle> = {
  low: { labelKey: "severities.low", muiColor: "success" },
  medium: { labelKey: "severities.medium", muiColor: "warning" },
  high: { labelKey: "severities.high", muiColor: "error" },
  critical: { labelKey: "severities.critical", muiColor: "error" },
};

export function isNotificationActionable(status: NotificationStatus): boolean {
  return status === "pending" || status === "draft";
}
