"use client";

import { useQuery } from "@tanstack/react-query";
import { ProjectWaterNotificationsApi } from "@/services/api/projects/notifications-water";
import {
  buildNotificationsEmployeesLocationsArgs,
  type NotificationScope,
} from "@/modules/projects/project/utils/notificationScope";

export interface UseProjectWaterNotificationEmployeesParams extends NotificationScope {
  latitude: number | undefined;
  longitude: number | undefined;
  enabled?: boolean;
  includeUnavailable?: boolean;
  statusesFilter?: string[];
}

export const PROJECT_WATER_NOTIFICATION_EMPLOYEES_QUERY_KEY =
  "project-water-notification-employees" as const;

export function projectWaterNotificationEmployeesQueryKey(
  params: UseProjectWaterNotificationEmployeesParams,
) {
  return [
    PROJECT_WATER_NOTIFICATION_EMPLOYEES_QUERY_KEY,
    params.projectId,
    params.contractualEngagementKey,
    params.latitude,
    params.longitude,
    params.includeUnavailable,
    params.statusesFilter,
  ] as const;
}

export function useProjectWaterNotificationEmployees(
  params: UseProjectWaterNotificationEmployeesParams,
) {
  const {
    projectId,
    contractualEngagementKey,
    latitude,
    longitude,
    enabled = true,
    includeUnavailable,
    statusesFilter,
  } = params;

  return useQuery({
    queryKey: projectWaterNotificationEmployeesQueryKey(params),
    queryFn: async () => {
      if (
        (!projectId && !contractualEngagementKey) ||
        latitude == null ||
        longitude == null
      ) {
        return [];
      }
      const res = await ProjectWaterNotificationsApi.getEmployeesWithLocations(
        buildNotificationsEmployeesLocationsArgs(
          { projectId, contractualEngagementKey },
          latitude,
          longitude,
          {
            include_unavailable: includeUnavailable,
            statuses: statusesFilter?.length ? statusesFilter : undefined,
          },
        ),
      );
      return res.data.payload ?? [];
    },
    enabled:
      enabled &&
      (!!projectId || !!contractualEngagementKey) &&
      latitude != null &&
      longitude != null,
    refetchInterval: 60_000,
  });
}
