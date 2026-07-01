"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";
import type { ProjectNotification, ProjectNotificationAvailableAction } from "@/services/api/projects/notifications/types/response";
import type {
  CreateProjectNotificationArgs,
  UpdateProjectNotificationArgs,
} from "@/services/api/projects/notifications/types/args";
import { projectNotificationsQueryKey } from "./useProjectNotifications";

export const PROJECT_NOTIFICATION_DETAIL_QUERY_KEY = "project-notification-detail" as const;
export const PROJECT_NOTIFICATION_AVAILABLE_ACTIONS_QUERY_KEY = "project-notification-available-actions" as const;

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
      const payload = res.data.payload;
      if (!payload) return null;
      if (Array.isArray(payload)) return payload[0] ?? null;
      return payload as unknown as ProjectNotification;
    },
    enabled: !!projectId && !!notificationId,
  });
}

export function useProjectNotificationAvailableActions(
  notificationId: string | undefined,
) {
  return useQuery<ProjectNotificationAvailableAction[]>({
    queryKey: [
      PROJECT_NOTIFICATION_AVAILABLE_ACTIONS_QUERY_KEY,
      notificationId,
    ],
    queryFn: async () => {
      if (!notificationId) return [];
      const res = await ProjectNotificationsApi.getAvailableActions(notificationId);
      const payload = res.data.payload;
      if (!payload) return [];
      if (Array.isArray(payload)) return payload;
      return [];
    },
    enabled: Boolean(notificationId),
  });
}
