"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveGroup,
  createGroup,
  deleteGroup,
  getGroups,
  restoreGroup,
  updateGroup,
} from "../api/groups";
import {
  getGroupMembers,
  putGroupMembers,
  putSendSettings,
} from "../api/group-members";
import { forumKeys } from "../query-keys";
import type {
  GroupBody,
  GroupListParams,
  GroupMemberRole,
  SendSettingsBody,
} from "../types";

export function useGroupsList(forumId: string, params: GroupListParams) {
  return useQuery({
    queryKey: forumKeys.groups(forumId, params),
    queryFn: () => getGroups(forumId, params),
    enabled: Boolean(forumId),
    refetchOnWindowFocus: false,
  });
}

export function useCreateGroup(forumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: GroupBody) => createGroup(forumId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.groupsRoot(forumId) });
      queryClient.invalidateQueries({ queryKey: forumKeys.detail(forumId) });
    },
  });
}

export function useUpdateGroup(forumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, body }: { groupId: string; body: GroupBody }) =>
      updateGroup(forumId, groupId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.groupsRoot(forumId) });
    },
  });
}

export function useGroupStatusActions(forumId: string) {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: forumKeys.groupsRoot(forumId) });
    queryClient.invalidateQueries({ queryKey: forumKeys.detail(forumId) });
  };

  const archive = useMutation({
    mutationFn: (groupId: string) => archiveGroup(forumId, groupId),
    onSuccess: invalidate,
  });
  const restore = useMutation({
    mutationFn: (groupId: string) => restoreGroup(forumId, groupId),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (groupId: string) => deleteGroup(forumId, groupId),
    onSuccess: invalidate,
  });

  return { archive, restore, remove };
}

export function useGroupMembers(forumId: string, groupId: string) {
  return useQuery({
    queryKey: forumKeys.groupMembers(forumId, groupId),
    queryFn: () => getGroupMembers(forumId, groupId),
    enabled: Boolean(forumId && groupId),
    refetchOnWindowFocus: false,
  });
}

export function useSaveGroupMembers(forumId: string, groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (members: { user_id: string; role: GroupMemberRole }[]) =>
      putGroupMembers(forumId, groupId, members),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: forumKeys.groupMembers(forumId, groupId),
      });
      queryClient.invalidateQueries({ queryKey: forumKeys.groupsRoot(forumId) });
      queryClient.invalidateQueries({ queryKey: forumKeys.membersRoot(forumId) });
    },
  });
}

export function useSaveSendSettings(forumId: string, groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SendSettingsBody) =>
      putSendSettings(forumId, groupId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.groupsRoot(forumId) });
      queryClient.invalidateQueries({
        queryKey: forumKeys.groupMembers(forumId, groupId),
      });
    },
  });
}
