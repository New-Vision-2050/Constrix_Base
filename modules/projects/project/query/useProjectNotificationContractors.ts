"use client";

import { useQuery } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";

export const PROJECT_NOTIFICATION_CONTRACTORS_QUERY_KEY =
  "project-notification-contractors" as const;

export function useProjectNotificationContractors() {
  return useQuery({
    queryKey: [PROJECT_NOTIFICATION_CONTRACTORS_QUERY_KEY],
    queryFn: async () => {
      const res = await ProjectNotificationsApi.getContractors();
      return res.data.payload ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
