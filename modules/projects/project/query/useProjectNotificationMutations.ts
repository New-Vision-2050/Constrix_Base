"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";
import type { ProjectNotification, ProjectNotificationAvailableAction, SiteStatusUpdatesData } from "@/services/api/projects/notifications/types/response";
import type {
  CreateProjectNotificationArgs,
  UpdateProjectNotificationArgs,
} from "@/services/api/projects/notifications/types/args";
import { projectNotificationsQueryKey } from "./useProjectNotifications";
import {
  buildNotificationScopeParams,
  hasNotificationScope,
  type NotificationScope,
} from "@/modules/projects/project/utils/notificationScope";

export const PROJECT_NOTIFICATION_DETAIL_QUERY_KEY = "project-notification-detail" as const;
export const PROJECT_NOTIFICATION_AVAILABLE_ACTIONS_QUERY_KEY = "project-notification-available-actions" as const;
export const SITE_STATUS_UPDATES_QUERY_KEY = "site-status-updates" as const;

function notificationScopeFromArgs(
  args: Pick<
    CreateProjectNotificationArgs | UpdateProjectNotificationArgs,
    "project_id" | "contractual_engagement_key"
  >,
): NotificationScope {
  return {
    projectId: args.project_id,
    contractualEngagementKey: args.contractual_engagement_key,
  };
}

export function useCreateProjectNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: CreateProjectNotificationArgs) => {
      const res = await ProjectNotificationsApi.create(args);
      return res.data.payload?.[0] ?? null;
    },
    onSuccess: (_, args) => {
      queryClient.invalidateQueries({
        queryKey: projectNotificationsQueryKey(
          notificationScopeFromArgs(args),
        ),
      });
    },
  });
}

export function useUpdateProjectNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: UpdateProjectNotificationArgs) => {
      const { id, project_id: _projectId, contractual_engagement_key: _key, ...rest } = args;
      const res = await ProjectNotificationsApi.update(id, rest);
      return res.data.payload?.[0] ?? null;
    },
    onSuccess: (_, args) => {
      const scope = notificationScopeFromArgs(args);
      queryClient.invalidateQueries({
        queryKey: projectNotificationsQueryKey(scope),
      });
      queryClient.invalidateQueries({
        queryKey: [
          PROJECT_NOTIFICATION_DETAIL_QUERY_KEY,
          scope.projectId,
          scope.contractualEngagementKey,
          args.id,
        ],
      });
    },
  });
}

export function useProjectNotificationDetail(
  scope: NotificationScope,
  notificationId: string | undefined,
) {
  return useQuery<ProjectNotification | null>({
    queryKey: [
      PROJECT_NOTIFICATION_DETAIL_QUERY_KEY,
      scope.projectId,
      scope.contractualEngagementKey,
      notificationId,
    ],
    queryFn: async () => {
      if (!notificationId) return null;
      const scopeParams = hasNotificationScope(scope)
        ? buildNotificationScopeParams(scope)
        : undefined;
      const res = await ProjectNotificationsApi.getById(
        notificationId,
        scopeParams,
      );
      const payload = res.data.payload;
      if (!payload) return null;
      if (Array.isArray(payload)) return payload[0] ?? null;
      return payload as unknown as ProjectNotification;
    },
    enabled: !!notificationId,
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

export function useSiteStatusUpdates(notificationId: string | undefined) {
  return useQuery<SiteStatusUpdatesData>({
    queryKey: [SITE_STATUS_UPDATES_QUERY_KEY, notificationId],
    queryFn: async (): Promise<SiteStatusUpdatesData> => {
      if (!notificationId) return { items: [], summary: { total: 0, approved: 0, pending: 0 } };
      const res = await ProjectNotificationsApi.getSiteStatusUpdates(notificationId);
      const body = res.data as any;
      const data = body?.data ?? body?.payload ?? body;
      const items = data?.items ?? [];
      const summary = data?.summary ?? { total: items.length, approved: 0, pending: 0 };
      return { items, summary };
    },
    enabled: Boolean(notificationId),
  });
}

export function useReassignProjectNotificationMutation(scope: NotificationScope) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      assignedUserIds,
    }: {
      id: string;
      assignedUserIds: string[];
    }): Promise<ProjectNotification | null> => {
      const res = await ProjectNotificationsApi.reassign(id, { assigned_user_ids: assignedUserIds });
      const payload = res.data.payload;
      if (!payload) return null;
      if (Array.isArray(payload)) return payload[0] ?? null;
      return payload as unknown as ProjectNotification;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectNotificationsQueryKey(scope),
      });
      queryClient.invalidateQueries({
        queryKey: [
          PROJECT_NOTIFICATION_DETAIL_QUERY_KEY,
          scope.projectId,
          scope.contractualEngagementKey,
          variables.id,
        ],
      });
      if (data) {
        queryClient.setQueryData<ProjectNotification | null>(
          [
            PROJECT_NOTIFICATION_DETAIL_QUERY_KEY,
            scope.projectId,
            scope.contractualEngagementKey,
            variables.id,
          ],
          data,
        );
      }
    },
  });
}
