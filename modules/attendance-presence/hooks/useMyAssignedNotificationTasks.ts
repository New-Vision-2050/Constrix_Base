import { useQuery } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";
import type {
  ProjectNotification,
  ProjectNotificationsListPagination,
} from "@/services/api/projects/notifications/types/response";
import type { ProjectNotificationsMobileListArgs } from "@/services/api/projects/notifications/types/args";

export const MY_ASSIGNED_NOTIFICATION_TASKS_QUERY_KEY =
  "my-assigned-notification-tasks" as const;

export interface UseMyAssignedNotificationTasksParams {
  page?: number;
  perPage?: number;
  status?: string;
  severity?: string;
  notificationType?: string;
  projectId?: string;
  search?: string;
}

export interface MyAssignedNotificationTasksResult {
  data: ProjectNotification[];
  pagination: ProjectNotificationsListPagination;
}

export function myAssignedNotificationTasksQueryKey(
  params: UseMyAssignedNotificationTasksParams,
) {
  return [MY_ASSIGNED_NOTIFICATION_TASKS_QUERY_KEY, params] as const;
}

export function useMyAssignedNotificationTasks(
  params: UseMyAssignedNotificationTasksParams = {},
) {
  const {
    page = 1,
    perPage = 10,
    status,
    severity,
    notificationType,
    projectId,
    search,
  } = params;

  return useQuery({
    queryKey: myAssignedNotificationTasksQueryKey(params),
    queryFn: async (): Promise<MyAssignedNotificationTasksResult> => {
      const args: ProjectNotificationsMobileListArgs = {
        page,
        per_page: perPage,
        ...(status ? { status } : {}),
        ...(severity ? { severity } : {}),
        ...(notificationType ? { notification_type: notificationType } : {}),
        ...(projectId ? { project_id: projectId } : {}),
        ...(search ? { search } : {}),
      };

      const res = await ProjectNotificationsApi.myTasks(args);
      const body = res.data;
      const rows = body.payload ?? [];
      const pagination = body.pagination ?? {
        page: 1,
        next_page: null,
        last_page: 1,
        result_count: rows.length,
      };

      return { data: rows, pagination };
    },
    placeholderData: (prev) => prev,
  });
}
