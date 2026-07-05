import { useQuery } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";
import type {
  ProjectNotification,
  ProjectNotificationsListPagination,
} from "@/services/api/projects/notifications/types/response";
import type { ProjectNotificationsListArgs } from "@/services/api/projects/notifications/types/args";
import {
  buildNotificationsListArgs,
  type NotificationScope,
} from "@/modules/projects/project/utils/notificationScope";

export const PROJECT_NOTIFICATIONS_QUERY_KEY = "project-notifications" as const;

export interface UseProjectNotificationsParams extends NotificationScope {
  page?: number;
  perPage?: number;
  status?: string;
  severity?: string;
  notificationType?: string;
  workType?: string;
  fromDate?: string;
  toDate?: string;
  assignedUserId?: string;
  search?: string;
}

export function projectNotificationsQueryKey(
  params: UseProjectNotificationsParams,
) {
  return [PROJECT_NOTIFICATIONS_QUERY_KEY, params] as const;
}

export interface ProjectNotificationsResult {
  data: ProjectNotification[];
  pagination: ProjectNotificationsListPagination;
}

export function useProjectNotifications(params: UseProjectNotificationsParams) {
  const {
    projectId,
    contractualEngagementKey,
    page = 1,
    perPage = 10,
    status,
    severity,
    notificationType,
    workType,
    fromDate,
    toDate,
    assignedUserId,
    search,
  } = params;

  return useQuery({
    queryKey: projectNotificationsQueryKey(params),
    queryFn: async (): Promise<ProjectNotificationsResult> => {
      const args: ProjectNotificationsListArgs = buildNotificationsListArgs(
        { projectId, contractualEngagementKey },
        {
          page,
          per_page: perPage,
          ...(status ? { status } : {}),
          ...(severity ? { severity } : {}),
          ...(notificationType ? { notification_type: notificationType } : {}),
          ...(workType ? { work_type: workType } : {}),
          ...(fromDate ? { from_date: fromDate } : {}),
          ...(toDate ? { to_date: toDate } : {}),
          ...(assignedUserId ? { assigned_user_id: assignedUserId } : {}),
          ...(search ? { search } : {}),
        },
      );

      const res = await ProjectNotificationsApi.getList(args);
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
    enabled: !!projectId || !!contractualEngagementKey,
    placeholderData: (prev) => prev,
  });
}
