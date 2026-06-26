"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";
import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";
import type {
  CreateProjectNotificationArgs,
  UpdateProjectNotificationArgs,
} from "@/services/api/projects/notifications/types/args";
import { projectNotificationsQueryKey } from "./useProjectNotifications";

export const PROJECT_NOTIFICATION_DETAIL_QUERY_KEY = "project-notification-detail" as const;

export function useCreateProjectNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: CreateProjectNotificationArgs) => {
      const res = await ProjectNotificationsApi.create(args);
      return res.data.payload?.[0] ?? null;
    },
    onSuccess: (_, args) => {
      queryClient.invalidateQueries({
        queryKey: projectNotificationsQueryKey({ projectId: args.project_id }),
      });
    },
  });
}

export function useUpdateProjectNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: UpdateProjectNotificationArgs) => {
      const { id, project_id, ...rest } = args;
      const res = await ProjectNotificationsApi.update(id, rest);
      return res.data.payload?.[0] ?? null;
    },
    onSuccess: (_, args) => {
      queryClient.invalidateQueries({
        queryKey: projectNotificationsQueryKey({ projectId: args.project_id }),
      });
      queryClient.invalidateQueries({
        queryKey: [
          PROJECT_NOTIFICATION_DETAIL_QUERY_KEY,
          args.project_id,
          args.id,
        ],
      });
    },
  });
}

export function useProjectNotificationDetail(
  projectId: string | undefined,
  notificationId: string | undefined,
) {
  return useQuery<ProjectNotification | null>({
    queryKey: [
      PROJECT_NOTIFICATION_DETAIL_QUERY_KEY,
      projectId,
      notificationId,
    ],
    queryFn: async () => {
      if (!projectId || !notificationId) return null;
      const res = await ProjectNotificationsApi.getById(notificationId);
      return res.data.payload?.[0] ?? null;
    },
    enabled: !!projectId && !!notificationId,
  });
}
