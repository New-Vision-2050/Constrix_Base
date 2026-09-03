"use client";

import { useQuery } from "@tanstack/react-query";
import { ProjectWaterNotificationsApi } from "@/services/api/projects/notifications-water";

export const PROJECT_WATER_NOTIFICATION_TYPES_QUERY_KEY =
  "project-water-notification-types" as const;

export function useProjectWaterNotificationTypes() {
  return useQuery({
    queryKey: [PROJECT_WATER_NOTIFICATION_TYPES_QUERY_KEY],
    queryFn: async () => {
      const res = await ProjectWaterNotificationsApi.getNotificationTypes();
      return res.data.payload ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
