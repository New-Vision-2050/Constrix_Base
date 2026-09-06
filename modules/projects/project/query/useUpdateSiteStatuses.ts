"use client";

import { useQuery } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";

export const UPDATE_SITE_STATUSES_QUERY_KEY = "update-site-statuses" as const;

export function useUpdateSiteStatuses(enabled = true) {
  return useQuery({
    queryKey: [UPDATE_SITE_STATUSES_QUERY_KEY],
    queryFn: async () => {
      const res = await ProjectNotificationsApi.getUpdateSiteStatuses();
      return res.data.payload ?? [];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
