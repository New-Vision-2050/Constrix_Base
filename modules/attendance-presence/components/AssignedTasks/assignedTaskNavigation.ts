import { ROUTER } from "@/router";
import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";

export function getAssignedTaskNotificationHref(
  row: ProjectNotification,
): string | null {
  const id = row.id?.trim();
  if (!id) return null;

  return ROUTER.ATTENDANCE_PRESENCE_ASSIGNED_TASK_DETAILS(id);
}
