"use client";

import { useQuery } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";

export const PROJECT_NOTIFICATION_TYPES_QUERY_KEY =
  "project-notification-types" as const;

export function useProjectNotificationTypes() {
  return useQuery({
    queryKey: [PROJECT_NOTIFICATION_TYPES_QUERY_KEY],
    queryFn: async () => {
      const res = await ProjectNotificationsApi.getNotificationTypes();
      return res.data.payload ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
