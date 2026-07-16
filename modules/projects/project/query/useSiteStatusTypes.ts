"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectNotificationsApi } from "@/services/api/projects/notifications";
import type {
  SiteStatusTypeKey,
  SiteStatusTypeWithKeys,
} from "@/services/api/projects/notifications/types/response";
import type {
  CreateSiteStatusTypeArgs,
  CreateSiteStatusTypeKeyArgs,
  UpdateSiteStatusTypeArgs,
  UpdateSiteStatusTypeKeyArgs,
} from "@/services/api/projects/notifications/types/args";

export const SITE_STATUS_TYPES_QUERY_KEY = "site-status-types" as const;
export const SITE_STATUS_TYPE_QUERY_KEY = "site-status-type" as const;
export const SITE_STATUS_TYPE_KEYS_QUERY_KEY = "site-status-type-keys" as const;

export interface UseSiteStatusTypesParams {
  projectTypeId?: string | number;
  projectId?: string;
}

export function siteStatusTypesQueryKey(params: UseSiteStatusTypesParams) {
  return [SITE_STATUS_TYPES_QUERY_KEY, params] as const;
}

export function siteStatusTypeQueryKey(siteStatusTypeId: string | undefined) {
  return [SITE_STATUS_TYPE_QUERY_KEY, siteStatusTypeId] as const;
}

export function siteStatusTypeKeysQueryKey(
  siteStatusTypeId: string | undefined,
) {
  return [SITE_STATUS_TYPE_KEYS_QUERY_KEY, siteStatusTypeId] as const;
}

export function useSiteStatusTypes(params: UseSiteStatusTypesParams) {
  return useQuery<SiteStatusTypeWithKeys[]>({
    queryKey: siteStatusTypesQueryKey(params),
    queryFn: async () => {
      const res = await ProjectNotificationsApi.getSiteStatusTypesWithKeys({
        ...(params.projectTypeId !== undefined
          ? { project_type_id: params.projectTypeId }
          : {}),
        ...(params.projectId ? { project_id: params.projectId } : {}),
      });
      return res.data.payload ?? [];
    },
    enabled: !!params.projectTypeId || !!params.projectId,
  });
}

export function useSiteStatusType(siteStatusTypeId: string | undefined) {
  return useQuery<SiteStatusTypeWithKeys | null>({
    queryKey: siteStatusTypeQueryKey(siteStatusTypeId),
    queryFn: async () => {
      if (!siteStatusTypeId) return null;
      const res = await ProjectNotificationsApi.getSiteStatusTypeById(
        siteStatusTypeId,
      );
      return res.data.payload ?? null;
    },
    enabled: !!siteStatusTypeId,
  });
}

export function useSiteStatusTypeKeys(siteStatusTypeId: string | undefined) {
  return useQuery<SiteStatusTypeKey[]>({
    queryKey: siteStatusTypeKeysQueryKey(siteStatusTypeId),
    queryFn: async () => {
      if (!siteStatusTypeId) return [];
      const res = await ProjectNotificationsApi.getSiteStatusTypeKeys(
        siteStatusTypeId,
      );
      return res.data.payload ?? [];
    },
    enabled: !!siteStatusTypeId,
  });
}

export function useCreateSiteStatusTypeMutation(
  params: UseSiteStatusTypesParams,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: CreateSiteStatusTypeArgs) =>
      ProjectNotificationsApi.createSiteStatusType(args),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: siteStatusTypesQueryKey(params),
      });
    },
  });
}

export function useUpdateSiteStatusTypeMutation(
  params: UseSiteStatusTypesParams,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      args,
    }: {
      id: string;
      args: UpdateSiteStatusTypeArgs;
    }) => ProjectNotificationsApi.updateSiteStatusType(id, args),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: siteStatusTypesQueryKey(params),
      });
      queryClient.invalidateQueries({
        queryKey: siteStatusTypeQueryKey(id),
      });
    },
  });
}

export function useDeleteSiteStatusTypeMutation(
  params: UseSiteStatusTypesParams,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProjectNotificationsApi.deleteSiteStatusType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: siteStatusTypesQueryKey(params),
      });
    },
  });
}

export function useCreateSiteStatusTypeKeyMutation(
  siteStatusTypeId: string | undefined,
  listParams: UseSiteStatusTypesParams,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: CreateSiteStatusTypeKeyArgs) => {
      if (!siteStatusTypeId) throw new Error("Site status type id is required");
      return ProjectNotificationsApi.createSiteStatusTypeKey(
        siteStatusTypeId,
        args,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: siteStatusTypeKeysQueryKey(siteStatusTypeId),
      });
      queryClient.invalidateQueries({
        queryKey: siteStatusTypesQueryKey(listParams),
      });
    },
  });
}

export function useUpdateSiteStatusTypeKeyMutation(
  siteStatusTypeId: string | undefined,
  listParams: UseSiteStatusTypesParams,
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
      return ProjectNotificationsApi.updateSiteStatusTypeKey(
        siteStatusTypeId,
        keyId,
        args,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: siteStatusTypeKeysQueryKey(siteStatusTypeId),
      });
      queryClient.invalidateQueries({
        queryKey: siteStatusTypesQueryKey(listParams),
      });
    },
  });
}

export function useDeleteSiteStatusTypeKeyMutation(
  siteStatusTypeId: string | undefined,
  listParams: UseSiteStatusTypesParams,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => {
      if (!siteStatusTypeId) throw new Error("Site status type id is required");
      return ProjectNotificationsApi.deleteSiteStatusTypeKey(
        siteStatusTypeId,
        keyId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: siteStatusTypeKeysQueryKey(siteStatusTypeId),
      });
      queryClient.invalidateQueries({
        queryKey: siteStatusTypesQueryKey(listParams),
      });
    },
  });
}

export function useCopyToClipboard() {
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
