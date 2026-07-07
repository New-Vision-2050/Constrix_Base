import { useQuery } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";
import type { NotificationChartsPayload } from "@/services/api/projects/notifications/types/response";
import type { ProjectNotificationsChartsArgs } from "@/services/api/projects/notifications/types/args";
import {
  buildNotificationsChartsArgs,
  type NotificationScope,
} from "@/modules/projects/project/utils/notificationScope";

export const PROJECT_NOTIFICATION_CHARTS_QUERY_KEY =
  "project-notification-charts" as const;

export type ChartFilterKey =
  | "status"
  | "notification_type"
  | "work_type"
  | "contractor_name"
  | "assigned_user_id"
  | "date_from"
  | "date_to"
  | "search";

export type ChartFilters = Partial<
  Pick<
    ProjectNotificationsChartsArgs,
    ChartFilterKey
  >
>;

export function projectNotificationChartsQueryKey(
  scope: NotificationScope,
  filters: ChartFilters,
) {
  return [
    PROJECT_NOTIFICATION_CHARTS_QUERY_KEY,
    scope.projectId,
    scope.contractualEngagementKey,
    filters,
  ] as const;
}

export function useProjectNotificationCharts(
  scope: NotificationScope,
  filters: ChartFilters,
) {
  const { projectId, contractualEngagementKey } = scope;

  return useQuery({
    queryKey: projectNotificationChartsQueryKey(scope, filters),
    queryFn: async (): Promise<NotificationChartsPayload> => {
      const args = buildNotificationsChartsArgs(scope, filters);
      const res = await ProjectNotificationsApi.getCharts(args);
      return res.data.payload;
    },
    enabled: !!projectId || !!contractualEngagementKey,
    placeholderData: (prev) => prev,
  });
}
