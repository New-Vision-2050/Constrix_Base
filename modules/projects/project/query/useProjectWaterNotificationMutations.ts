"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectWaterNotificationsApi } from "@/services/api/projects/notifications-water";
import type {
  ProjectNotification,
  ProjectNotificationAvailableAction,
  ProjectNotificationNote,
  ProjectNotificationNotesData,
  SiteStatusUpdatesData,
} from "@/services/api/projects/notifications-water/types/response";
import type {
  CopySiteStatusUpdateArgs,
  CreateProjectNotificationArgs,
  CreateProjectNotificationNoteArgs,
  ProjectNotificationReadStatusArgs,
  UpdateProjectNotificationArgs,
} from "@/services/api/projects/notifications-water/types/args";
import {
  projectWaterNotificationsQueryKey,
  PROJECT_WATER_NOTIFICATIONS_QUERY_KEY,
  type ProjectWaterNotificationsResult,
} from "./useProjectWaterNotifications";
import {
  buildNotificationScopeParams,
  hasNotificationScope,
  type NotificationScope,
} from "@/modules/projects/project/utils/notificationScope";

export const PROJECT_WATER_NOTIFICATION_DETAIL_QUERY_KEY = "project-water-notification-detail" as const;
export const PROJECT_WATER_NOTIFICATION_AVAILABLE_ACTIONS_QUERY_KEY = "project-water-notification-available-actions" as const;
export const WATER_SITE_STATUS_UPDATES_QUERY_KEY = "water-site-status-updates" as const;
export const WATER_COPIED_SITE_STATUS_UPDATES_QUERY_KEY = "water-copied-site-status-updates" as const;
export const PROJECT_WATER_NOTIFICATION_NOTES_QUERY_KEY = "project-water-notification-notes" as const;

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

export function useCreateProjectWaterNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: CreateProjectNotificationArgs) => {
      const res = await ProjectWaterNotificationsApi.create(args);
      return res.data.payload?.[0] ?? null;
    },
    onSuccess: (_, args) => {
      queryClient.invalidateQueries({
        queryKey: projectWaterNotificationsQueryKey(
          notificationScopeFromArgs(args),
        ),
      });
    },
  });
}

export function useUpdateProjectWaterNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: UpdateProjectNotificationArgs) => {
      const { id, project_id: _projectId, contractual_engagement_key: _key, ...rest } = args;
      const res = await ProjectWaterNotificationsApi.update(id, rest);
      return res.data.payload?.[0] ?? null;
    },
    onSuccess: (_, args) => {
      const scope = notificationScopeFromArgs(args);
      queryClient.invalidateQueries({
        queryKey: projectWaterNotificationsQueryKey(scope),
      });
      queryClient.invalidateQueries({
        queryKey: [
          PROJECT_WATER_NOTIFICATION_DETAIL_QUERY_KEY,
          scope.projectId,
          scope.contractualEngagementKey,
          args.id,
        ],
      });
    },
  });
}

export function useSaveProjectWaterNotificationDraftMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      args: CreateProjectNotificationArgs | UpdateProjectNotificationArgs,
    ) => {
      if ("id" in args) {
        const {
          id,
          project_id: _projectId,
          contractual_engagement_key: _key,
          ...rest
        } = args as UpdateProjectNotificationArgs & {
          project_id?: string;
          contractual_engagement_key?: string;
        };
        const res = await ProjectWaterNotificationsApi.update(id, {
          ...rest,
          is_draft: true,
        });
        return res.data.payload?.[0] ?? null;
      }
      const res = await ProjectWaterNotificationsApi.create({
        ...args,
        is_draft: true,
      });
      return res.data.payload?.[0] ?? null;
    },
    onSuccess: (_, args) => {
      const scope = notificationScopeFromArgs(args);
      queryClient.invalidateQueries({
        queryKey: projectWaterNotificationsQueryKey(scope),
      });
      if ("id" in args) {
        queryClient.invalidateQueries({
          queryKey: [
            PROJECT_WATER_NOTIFICATION_DETAIL_QUERY_KEY,
            scope.projectId,
            scope.contractualEngagementKey,
            args.id,
          ],
        });
      }
    },
  });
}

export function useProjectWaterNotificationDetail(
  scope: NotificationScope,
  notificationId: string | undefined,
) {
  return useQuery<ProjectNotification | null>({
    queryKey: [
      PROJECT_WATER_NOTIFICATION_DETAIL_QUERY_KEY,
      scope.projectId,
      scope.contractualEngagementKey,
      notificationId,
    ],
    queryFn: async () => {
      if (!notificationId) return null;
      const scopeParams = hasNotificationScope(scope)
        ? buildNotificationScopeParams(scope)
        : undefined;
      const res = await ProjectWaterNotificationsApi.getById(
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

export function useProjectWaterNotificationAvailableActions(
  notificationId: string | undefined,
) {
  return useQuery<ProjectNotificationAvailableAction[]>({
    queryKey: [
      PROJECT_WATER_NOTIFICATION_AVAILABLE_ACTIONS_QUERY_KEY,
      notificationId,
    ],
    queryFn: async () => {
      if (!notificationId) return [];
      const res = await ProjectWaterNotificationsApi.getAvailableActions(notificationId);
      const payload = res.data.payload;
      if (!payload) return [];
      if (Array.isArray(payload)) return payload;
      return [];
    },
    enabled: Boolean(notificationId),
  });
}

export function useWaterSiteStatusUpdates(notificationId: string | undefined) {
  return useQuery<SiteStatusUpdatesData>({
    queryKey: [WATER_SITE_STATUS_UPDATES_QUERY_KEY, notificationId],
    queryFn: async (): Promise<SiteStatusUpdatesData> => {
      if (!notificationId) {
        return {
          items: [],
          summary: { total: 0, approved: 0, pending: 0 },
          site_status_type: null,
          notification_values: null,
        };
      }
      const res = await ProjectWaterNotificationsApi.getSiteStatusUpdates(notificationId);
      const body = res.data as Record<string, unknown>;
      const data = (body?.data ?? body?.payload ?? body) as SiteStatusUpdatesData;
      const items = data?.items ?? [];
      const summary = data?.summary ?? {
        total: items.length,
        approved: 0,
        pending: 0,
      };
      return {
        items,
        summary,
        site_status_type: data?.site_status_type ?? null,
        notification_values: data?.notification_values ?? null,
      };
    },
    enabled: Boolean(notificationId),
  });
}

export function useWaterCopiedSiteStatusUpdates(notificationId: string | undefined) {
  return useQuery<SiteStatusUpdatesData>({
    queryKey: [WATER_COPIED_SITE_STATUS_UPDATES_QUERY_KEY, notificationId],
    queryFn: async (): Promise<SiteStatusUpdatesData> => {
      if (!notificationId) return { items: [], summary: { total: 0, approved: 0, pending: 0 } };
      const res = await ProjectWaterNotificationsApi.getCopiedSiteStatusUpdates(notificationId);
      const body = res.data as any;
      const data = body?.data ?? body?.payload ?? body;
      const items = data?.items ?? [];
      const summary = data?.summary ?? { total: items.length, approved: 0, pending: 0 };
      return { items, summary };
    },
    enabled: Boolean(notificationId),
  });
}

export function useWaterCopySiteStatusUpdateMutation(notificationId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (siteStatusUpdateId: string): Promise<SiteStatusUpdatesData | null> => {
      if (!notificationId) return null;
      const res = await ProjectWaterNotificationsApi.copySiteStatusUpdate({
        notification_id: notificationId,
        site_status_update_id: siteStatusUpdateId,
      });
      const body = res.data as any;
      const data = body?.data ?? body?.payload ?? body;
      const items = data?.items ?? [];
      const summary = data?.summary ?? { total: items.length, approved: 0, pending: 0 };
      return { items, summary };
    },
    onSuccess: () => {
      if (!notificationId) return;
      queryClient.invalidateQueries({
        queryKey: [WATER_SITE_STATUS_UPDATES_QUERY_KEY, notificationId],
      });
      queryClient.invalidateQueries({
        queryKey: [WATER_COPIED_SITE_STATUS_UPDATES_QUERY_KEY, notificationId],
      });
    },
  });
}

export function useProjectWaterNotificationNotes(notificationId: string | undefined) {
  return useQuery<ProjectNotificationNotesData>({
    queryKey: [PROJECT_WATER_NOTIFICATION_NOTES_QUERY_KEY, notificationId],
    queryFn: async (): Promise<ProjectNotificationNotesData> => {
      if (!notificationId) return { items: [], timezone: null };
      const res = await ProjectWaterNotificationsApi.getNotes(notificationId);
      const body = res.data as any;
      const data = body?.data ?? body?.payload ?? body;
      const items = data?.items ?? [];
      const timezone = data?.timezone ?? null;
      return { items, timezone };
    },
    enabled: Boolean(notificationId),
  });
}

export function useAddProjectWaterNotificationNoteMutation(
  notificationId: string | undefined,
  scope: NotificationScope,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: CreateProjectNotificationNoteArgs): Promise<ProjectNotificationNote | null> => {
      if (!notificationId) return null;
      const res = await ProjectWaterNotificationsApi.addNote(notificationId, args);
      const body = res.data as any;
      return body?.payload ?? body?.data ?? body ?? null;
    },
    onSuccess: (note) => {
      if (!notificationId) return;
      queryClient.setQueryData<ProjectNotificationNotesData>(
        [PROJECT_WATER_NOTIFICATION_NOTES_QUERY_KEY, notificationId],
        (old) => {
          if (!old) return { items: note ? [note] : [], timezone: null };
          if (!note) return old;
          return { ...old, items: [note, ...old.items] };
        },
      );
      queryClient.invalidateQueries({
        queryKey: projectWaterNotificationsQueryKey(scope),
      });
      queryClient.invalidateQueries({
        queryKey: [
          PROJECT_WATER_NOTIFICATION_DETAIL_QUERY_KEY,
          scope.projectId,
          scope.contractualEngagementKey,
          notificationId,
        ],
      });
    },
  });
}

export function useReassignProjectWaterNotificationMutation(scope: NotificationScope) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      assignedUserIds,
    }: {
      id: string;
      assignedUserIds: string[];
    }): Promise<ProjectNotification | null> => {
      const res = await ProjectWaterNotificationsApi.reassign(id, { assigned_user_ids: assignedUserIds });
      const payload = res.data.payload;
      if (!payload) return null;
      if (Array.isArray(payload)) return payload[0] ?? null;
      return payload as unknown as ProjectNotification;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectWaterNotificationsQueryKey(scope),
      });
      queryClient.invalidateQueries({
        queryKey: [
          PROJECT_WATER_NOTIFICATION_DETAIL_QUERY_KEY,
          scope.projectId,
          scope.contractualEngagementKey,
          variables.id,
        ],
      });
      if (data) {
        queryClient.setQueryData<ProjectNotification | null>(
          [
            PROJECT_WATER_NOTIFICATION_DETAIL_QUERY_KEY,
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

export function useProjectWaterNotificationReadStatusMutation(scope: NotificationScope) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      is_read,
    }: {
      id: string;
      is_read: boolean;
    }): Promise<ProjectNotification | null> => {
      const args: ProjectNotificationReadStatusArgs = { is_read };
      const res = await ProjectWaterNotificationsApi.readStatus(id, args);
      const payload = res.data.payload;
      if (!payload) return null;
      if (Array.isArray(payload)) return payload[0] ?? null;
      return payload as unknown as ProjectNotification;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueriesData<ProjectWaterNotificationsResult | null>(
        { queryKey: [PROJECT_WATER_NOTIFICATIONS_QUERY_KEY] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((row) =>
              row.id === variables.id ? { ...row, is_read: variables.is_read } : row,
            ),
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: projectWaterNotificationsQueryKey(scope),
      });
      queryClient.invalidateQueries({
        queryKey: [
          PROJECT_WATER_NOTIFICATION_DETAIL_QUERY_KEY,
          scope.projectId,
          scope.contractualEngagementKey,
          variables.id,
        ],
      });
      if (data) {
        queryClient.setQueryData<ProjectNotification | null>(
          [
            PROJECT_WATER_NOTIFICATION_DETAIL_QUERY_KEY,
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
