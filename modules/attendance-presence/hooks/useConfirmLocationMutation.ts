import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";
import type { ConfirmLocationArgs } from "@/services/api/projects/notifications/types/args";
import { MY_ASSIGNED_NOTIFICATION_TASKS_QUERY_KEY } from "./useMyAssignedNotificationTasks";
import { PROJECT_NOTIFICATION_AVAILABLE_ACTIONS_QUERY_KEY } from "@/modules/projects/project/query/useProjectNotificationMutations";

export function useConfirmLocationMutation(notificationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: ConfirmLocationArgs) =>
      ProjectNotificationsApi.confirmLocation(notificationId, args),
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
