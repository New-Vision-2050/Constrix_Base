import { useQuery } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";
import type {
  ProjectNotificationMapTask,
  ProjectNotificationMapTaskItem,
  ProjectNotificationMapTasksPayload,
  ProjectNotificationMapTaskStatusOption,
} from "@/services/api/projects/notifications/types/response";
import {
  buildNotificationsMapTasksArgs,
  type NotificationScope,
} from "@/modules/projects/project/utils/notificationScope";

export const PROJECT_NOTIFICATION_MAP_TASKS_QUERY_KEY =
  "project-notification-map-tasks" as const;

function toNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function resolveMapTasksPayload(
  payload:
    | ProjectNotificationMapTasksPayload
    | ProjectNotificationMapTaskItem[]
    | null
    | undefined,
): ProjectNotificationMapTaskItem[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload.items) ? payload.items : [];
}

function normalizeMapTask(
  item: ProjectNotificationMapTaskItem,
): ProjectNotificationMapTask | null {
  const latitude = toNumber(item.latitude);
  const longitude = toNumber(item.longitude);
  const radius = toNumber(item.radius);

  if (latitude == null || longitude == null) return null;

  const taskName = item.task_name?.trim();
  const notificationNumber = item.notification_number?.trim() || null;
  const name = taskName || notificationNumber || item.id;

  const assignedUserName =
    item.assigned_user?.name?.trim() ||
    (typeof item.assigned_user === "string"
      ? item.assigned_user.trim()
      : null) ||
    item.assigned_user_name?.trim() ||
    item.contractor_technical_name?.trim() ||
    item.contractor_name?.trim() ||
    null;

  return {
    id: item.id,
    name,
    notificationNumber,
    latitude,
    longitude,
    radius: radius ?? 100,
    status: item.status,
    statusLabel: item.status_label?.trim() || null,
    assignedUserName,
    receiveDate: item.receive_date,
  };
}

export function projectNotificationMapTasksQueryKey(
  scope: NotificationScope,
  status?: string,
) {
  return [
    PROJECT_NOTIFICATION_MAP_TASKS_QUERY_KEY,
    scope.projectId,
    scope.contractualEngagementKey,
    status,
  ] as const;
}

export interface ProjectNotificationMapTasksData {
  items: ProjectNotificationMapTask[];
  statuses: ProjectNotificationMapTaskStatusOption[];
}

export function useProjectNotificationMapTasks(
  scope: NotificationScope,
  status?: string,
) {
  const { projectId, contractualEngagementKey } = scope;

  return useQuery({
    queryKey: projectNotificationMapTasksQueryKey(scope, status),
    queryFn: async (): Promise<ProjectNotificationMapTasksData> => {
      const res = await ProjectNotificationsApi.getMapTasks(
        buildNotificationsMapTasksArgs(scope, status),
      );

      const payload = res.data.payload;
      const items = resolveMapTasksPayload(payload);
      const statuses = Array.isArray(payload?.statuses) ? payload.statuses : [];

      return {
        items: items
          .map((item) => normalizeMapTask(item))
          .filter((item): item is ProjectNotificationMapTask => item != null),
        statuses,
      };
    },
    enabled: !!projectId || !!contractualEngagementKey,
  });
}
