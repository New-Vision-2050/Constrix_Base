import { useQuery } from "@tanstack/react-query";
import { ProjectWaterNotificationsApi } from "@/services/api/projects/notifications-water";
import type {
  ProjectNotification,
  ProjectNotificationsListPagination,
} from "@/services/api/projects/notifications-water/types/response";
import type { ProjectNotificationsListArgs } from "@/services/api/projects/notifications-water/types/args";
import {
  buildNotificationsListArgs,
  type NotificationScope,
} from "@/modules/projects/project/utils/notificationScope";

export const PROJECT_WATER_NOTIFICATIONS_QUERY_KEY = "project-water-notifications" as const;

export interface UseProjectWaterNotificationsParams extends NotificationScope {
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

export function projectWaterNotificationsQueryKey(
  params: UseProjectWaterNotificationsParams,
) {
  return [PROJECT_WATER_NOTIFICATIONS_QUERY_KEY, params] as const;
}

export interface ProjectWaterNotificationsResult {
  data: ProjectNotification[];
  pagination: ProjectNotificationsListPagination;
}

export function useProjectWaterNotifications(params: UseProjectWaterNotificationsParams) {
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
    queryKey: projectWaterNotificationsQueryKey(params),
    queryFn: async (): Promise<ProjectWaterNotificationsResult> => {
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

      const res = await ProjectWaterNotificationsApi.getList(args);
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
