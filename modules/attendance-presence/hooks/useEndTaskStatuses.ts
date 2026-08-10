import { useQuery } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";
import { extractEndTaskStatuses } from "@/services/api/projects/notifications/types/response";

export const END_TASK_STATUSES_QUERY_KEY = "end-task-statuses" as const;

export function useEndTaskStatuses(enabled = true) {
  return useQuery({
    queryKey: [END_TASK_STATUSES_QUERY_KEY],
    queryFn: async () => {
      const res = await ProjectNotificationsApi.getEndTaskStatuses();
      return extractEndTaskStatuses(res.data);
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
