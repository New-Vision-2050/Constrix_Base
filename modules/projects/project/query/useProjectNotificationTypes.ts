"use client";

import { useQuery } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";

export const PROJECT_NOTIFICATION_TYPES_QUERY_KEY =
  "project-notification-types" as const;

export function useProjectNotificationTypes(type?: string) {
  return useQuery({
    queryKey: [PROJECT_NOTIFICATION_TYPES_QUERY_KEY, type ?? ""],
    queryFn: async () => {
      const res = await ProjectNotificationsApi.getNotificationTypes(
        type ? { type } : undefined,
      );
      return res.data.payload ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
