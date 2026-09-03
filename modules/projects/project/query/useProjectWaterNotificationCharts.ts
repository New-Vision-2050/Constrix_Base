import { useQuery } from "@tanstack/react-query";
import { ProjectWaterNotificationsApi } from "@/services/api/projects/notifications-water";
import type { NotificationChartsPayload } from "@/services/api/projects/notifications-water/types/response";
import type { ProjectNotificationsChartsArgs } from "@/services/api/projects/notifications-water/types/args";
import {
  buildNotificationsChartsArgs,
  type NotificationScope,
} from "@/modules/projects/project/utils/notificationScope";

export const PROJECT_WATER_NOTIFICATION_CHARTS_QUERY_KEY =
  "project-water-notification-charts" as const;

export type WaterChartFilterKey =
  | "status"
  | "notification_type"
  | "work_type"
  | "severity"
  | "contractor_id"
  | "contractor_category"
  | "assigned_user_id"
  | "date_from"
  | "date_to"
  | "search";

export type WaterChartFilters = Partial<
  Pick<
    ProjectNotificationsChartsArgs,
    WaterChartFilterKey
  >
>;

export function projectWaterNotificationChartsQueryKey(
  scope: NotificationScope,
  filters: WaterChartFilters,
) {
  return [
    PROJECT_WATER_NOTIFICATION_CHARTS_QUERY_KEY,
    scope.projectId,
    scope.contractualEngagementKey,
    filters,
  ] as const;
}

export function useProjectWaterNotificationCharts(
  scope: NotificationScope,
  filters: WaterChartFilters,
) {
  const { projectId, contractualEngagementKey } = scope;

  return useQuery({
    queryKey: projectWaterNotificationChartsQueryKey(scope, filters),
    queryFn: async (): Promise<NotificationChartsPayload> => {
      const args = buildNotificationsChartsArgs(scope, filters);
      const res = await ProjectWaterNotificationsApi.getCharts(args);
      return res.data.payload;
    },
    enabled: !!projectId || !!contractualEngagementKey,
    placeholderData: (prev) => prev,
  });
}
