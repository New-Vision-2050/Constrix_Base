"use client";

import { useQuery } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";
import {
  buildNotificationsEmployeesLocationsArgs,
  type NotificationScope,
} from "@/modules/projects/project/utils/notificationScope";

export interface UseProjectNotificationEmployeesParams extends NotificationScope {
  latitude: number | undefined;
  longitude: number | undefined;
  enabled?: boolean;
}

export const PROJECT_NOTIFICATION_EMPLOYEES_QUERY_KEY =
  "project-notification-employees" as const;

export function projectNotificationEmployeesQueryKey(
  params: UseProjectNotificationEmployeesParams,
) {
  return [
    PROJECT_NOTIFICATION_EMPLOYEES_QUERY_KEY,
    params.projectId,
    params.contractualEngagementKey,
    params.latitude,
    params.longitude,
  ] as const;
}

export function useProjectNotificationEmployees(
  params: UseProjectNotificationEmployeesParams,
) {
  const {
    projectId,
    contractualEngagementKey,
    latitude,
    longitude,
    enabled = true,
  } = params;

  return useQuery({
    queryKey: projectNotificationEmployeesQueryKey(params),
    queryFn: async () => {
      if (
        (!projectId && !contractualEngagementKey) ||
        latitude == null ||
        longitude == null
      ) {
        return [];
      }
      const res = await ProjectNotificationsApi.getEmployeesWithLocations(
        buildNotificationsEmployeesLocationsArgs(
          { projectId, contractualEngagementKey },
          latitude,
          longitude,
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
