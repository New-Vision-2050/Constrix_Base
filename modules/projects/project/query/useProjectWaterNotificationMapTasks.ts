import { useQuery } from "@tanstack/react-query";
import { ProjectWaterNotificationsApi } from "@/services/api/projects/notifications-water";
import type {
  ProjectNotificationMapTask,
  ProjectNotificationMapTaskItem,
  ProjectNotificationMapTasksPayload,
  ProjectNotificationMapTaskStatusOption,
} from "@/services/api/projects/notifications-water/types/response";
import {
  buildNotificationsMapTasksArgs,
  type NotificationScope,
} from "@/modules/projects/project/utils/notificationScope";

export const PROJECT_WATER_NOTIFICATION_MAP_TASKS_QUERY_KEY =
  "project-water-notification-map-tasks" as const;

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
    item.assigned_users && item.assigned_users.length > 0
      ? item.assigned_users.map((u) => u.name).join(", ")
      : item.assigned_user?.name?.trim() ||
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

export interface ProjectWaterNotificationMapTasksFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function projectWaterNotificationMapTasksQueryKey(
  scope: NotificationScope,
  filters: ProjectWaterNotificationMapTasksFilters = {},
) {
  return [
    PROJECT_WATER_NOTIFICATION_MAP_TASKS_QUERY_KEY,
    scope.projectId,
    scope.contractualEngagementKey,
    filters.status,
    filters.dateFrom,
    filters.dateTo,
  ] as const;
}

export interface ProjectWaterNotificationMapTasksData {
  items: ProjectNotificationMapTask[];
  statuses: ProjectNotificationMapTaskStatusOption[];
}

export function useProjectWaterNotificationMapTasks(
  scope: NotificationScope,
  filters: ProjectWaterNotificationMapTasksFilters = {},
) {
  const { projectId, contractualEngagementKey } = scope;
  const { status, dateFrom, dateTo } = filters;

  return useQuery({
    queryKey: projectWaterNotificationMapTasksQueryKey(scope, filters),
    queryFn: async (): Promise<ProjectWaterNotificationMapTasksData> => {
      const res = await ProjectWaterNotificationsApi.getMapTasks(
        buildNotificationsMapTasksArgs(scope, {
          status: status || undefined,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
        }),
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
