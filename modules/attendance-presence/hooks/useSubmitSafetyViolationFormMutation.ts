import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";
import type { RequestSafetyViolationArgs } from "@/services/api/projects/notifications/types/args";
import { PROJECT_NOTIFICATION_AVAILABLE_ACTIONS_QUERY_KEY } from "@/modules/projects/project/query/useProjectNotificationMutations";
import { MY_ASSIGNED_NOTIFICATION_TASKS_QUERY_KEY } from "./useMyAssignedNotificationTasks";

export function useSubmitSafetyViolationFormMutation(notificationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: RequestSafetyViolationArgs) =>
      ProjectNotificationsApi.requestSafetyViolation(notificationId, args),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MY_ASSIGNED_NOTIFICATION_TASKS_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [PROJECT_NOTIFICATION_AVAILABLE_ACTIONS_QUERY_KEY, notificationId],
      });
    },
  });
}
