"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectWaterNotificationsApi } from "@/services/api/projects/notifications-water";
import type {
  SiteStatusTypeKey,
  SiteStatusTypeWithKeys,
} from "@/services/api/projects/notifications-water/types/response";
import type {
  CreateSiteStatusTypeArgs,
  CreateSiteStatusTypeKeyArgs,
  UpdateSiteStatusTypeArgs,
  UpdateSiteStatusTypeKeyArgs,
} from "@/services/api/projects/notifications-water/types/args";

export const WATER_SITE_STATUS_TYPES_QUERY_KEY = "water-site-status-types" as const;
export const WATER_SITE_STATUS_TYPE_QUERY_KEY = "water-site-status-type" as const;
export const WATER_SITE_STATUS_TYPE_KEYS_QUERY_KEY = "water-site-status-type-keys" as const;

export interface UseWaterSiteStatusTypesParams {
  projectTypeId?: string | number;
  projectId?: string;
  notificationTypeId?: string;
}

export function waterSiteStatusTypesQueryKey(params: UseWaterSiteStatusTypesParams) {
  return [WATER_SITE_STATUS_TYPES_QUERY_KEY, params] as const;
}

export function waterSiteStatusTypeQueryKey(siteStatusTypeId: string | undefined) {
  return [WATER_SITE_STATUS_TYPE_QUERY_KEY, siteStatusTypeId] as const;
}

export function waterSiteStatusTypeKeysQueryKey(
  siteStatusTypeId: string | undefined,
) {
  return [WATER_SITE_STATUS_TYPE_KEYS_QUERY_KEY, siteStatusTypeId] as const;
}

export function useWaterSiteStatusTypes(params: UseWaterSiteStatusTypesParams) {
  return useQuery<SiteStatusTypeWithKeys[]>({
    queryKey: waterSiteStatusTypesQueryKey(params),
    queryFn: async () => {
      const res = await ProjectWaterNotificationsApi.getSiteStatusTypesWithKeysEndpoint({
        ...(params.projectTypeId !== undefined
          ? { project_type_id: params.projectTypeId }
          : {}),
        ...(params.projectId ? { project_id: params.projectId } : {}),
        ...(params.notificationTypeId
          ? { notification_type_id: params.notificationTypeId }
          : {}),
      });
      return res.data.payload ?? [];
    },
    enabled: !!params.projectTypeId || !!params.projectId,
  });
}

export function useWaterSiteStatusType(siteStatusTypeId: string | undefined) {
  return useQuery<SiteStatusTypeWithKeys | null>({
    queryKey: waterSiteStatusTypeQueryKey(siteStatusTypeId),
    queryFn: async () => {
      if (!siteStatusTypeId) return null;
      const res = await ProjectWaterNotificationsApi.getSiteStatusTypeById(
        siteStatusTypeId,
      );
      return res.data.payload ?? null;
    },
    enabled: !!siteStatusTypeId,
  });
}

export function useWaterSiteStatusTypeKeys(siteStatusTypeId: string | undefined) {
  return useQuery<SiteStatusTypeKey[]>({
    queryKey: waterSiteStatusTypeKeysQueryKey(siteStatusTypeId),
    queryFn: async () => {
      if (!siteStatusTypeId) return [];
      const res = await ProjectWaterNotificationsApi.getSiteStatusTypeKeys(
        siteStatusTypeId,
      );
      return res.data.payload ?? [];
    },
    enabled: !!siteStatusTypeId,
  });
}

export function useCreateWaterSiteStatusTypeMutation(
  params: UseWaterSiteStatusTypesParams,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: CreateSiteStatusTypeArgs) =>
      ProjectWaterNotificationsApi.createSiteStatusType(args),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: waterSiteStatusTypesQueryKey(params),
      });
    },
  });
}

export function useUpdateWaterSiteStatusTypeMutation(
  params: UseWaterSiteStatusTypesParams,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      args,
    }: {
      id: string;
      args: UpdateSiteStatusTypeArgs;
    }) => ProjectWaterNotificationsApi.updateSiteStatusType(id, args),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: waterSiteStatusTypesQueryKey(params),
      });
      queryClient.invalidateQueries({
        queryKey: waterSiteStatusTypeQueryKey(id),
      });
    },
  });
}

export function useDeleteWaterSiteStatusTypeMutation(
  params: UseWaterSiteStatusTypesParams,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProjectWaterNotificationsApi.deleteSiteStatusType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: waterSiteStatusTypesQueryKey(params),
      });
    },
  });
}

export function useCreateWaterSiteStatusTypeKeyMutation(
  siteStatusTypeId: string | undefined,
  listParams: UseWaterSiteStatusTypesParams,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: CreateSiteStatusTypeKeyArgs) => {
      if (!siteStatusTypeId) throw new Error("Site status type id is required");
      return ProjectWaterNotificationsApi.createSiteStatusTypeKey(
        siteStatusTypeId,
        args,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: waterSiteStatusTypeKeysQueryKey(siteStatusTypeId),
      });
      queryClient.invalidateQueries({
        queryKey: waterSiteStatusTypesQueryKey(listParams),
      });
    },
  });
}

export function useUpdateWaterSiteStatusTypeKeyMutation(
  siteStatusTypeId: string | undefined,
  listParams: UseWaterSiteStatusTypesParams,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      keyId,
      args,
    }: {
      keyId: string;
      args: UpdateSiteStatusTypeKeyArgs;
    }) => {
      if (!siteStatusTypeId) throw new Error("Site status type id is required");
      return ProjectWaterNotificationsApi.updateSiteStatusTypeKey(
        siteStatusTypeId,
        keyId,
        args,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: waterSiteStatusTypeKeysQueryKey(siteStatusTypeId),
      });
      queryClient.invalidateQueries({
        queryKey: waterSiteStatusTypesQueryKey(listParams),
      });
    },
  });
}

export function useDeleteWaterSiteStatusTypeKeyMutation(
  siteStatusTypeId: string | undefined,
  listParams: UseWaterSiteStatusTypesParams,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => {
      if (!siteStatusTypeId) throw new Error("Site status type id is required");
      return ProjectWaterNotificationsApi.deleteSiteStatusTypeKey(
        siteStatusTypeId,
        keyId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: waterSiteStatusTypeKeysQueryKey(siteStatusTypeId),
      });
      queryClient.invalidateQueries({
        queryKey: waterSiteStatusTypesQueryKey(listParams),
      });
    },
  });
}

export function useWaterCopyToClipboard() {
  return async (text: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (successMessage) toast.success(successMessage);
      return true;
    } catch {
      toast.error("Failed to copy to clipboard");
      return false;
    }
  };
}
