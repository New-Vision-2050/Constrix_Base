"use client";

import { useQuery } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";

export interface UseProjectNotificationEmployeesParams {
  projectId: string | undefined;
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
    params.latitude,
    params.longitude,
  ] as const;
}

export function useProjectNotificationEmployees(
  params: UseProjectNotificationEmployeesParams,
) {
  const { projectId, latitude, longitude, enabled = true } = params;

  return useQuery({
    queryKey: projectNotificationEmployeesQueryKey(params),
    queryFn: async () => {
      if (!projectId || latitude == null || longitude == null) return [];
      const res = await ProjectNotificationsApi.getEmployeesWithLocations({
        project_id: projectId,
        latitude,
        longitude,
      });
      return res.data.payload ?? [];
    },
    enabled: enabled && !!projectId && latitude != null && longitude != null,
    refetchInterval: 60_000,
  });
}
