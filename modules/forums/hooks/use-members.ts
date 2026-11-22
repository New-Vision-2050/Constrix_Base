"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getForumMembers,
  putForumMembers,
  putMemberGroups,
} from "../api/members";
import { getAdmins, putAdmins } from "../api/admins";
import { forumKeys } from "../query-keys";
import type {
  ForumAdminInput,
  ForumMemberListParams,
  GroupMemberRole,
} from "../types";

export function useForumMembers(
  forumId: string,
  params: ForumMemberListParams,
) {
  return useQuery({
    queryKey: forumKeys.members(forumId, params),
    queryFn: () => getForumMembers(forumId, params),
    enabled: Boolean(forumId),
    refetchOnWindowFocus: false,
  });
}

export function useSaveForumMembers(forumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberIds: string[]) => putForumMembers(forumId, memberIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.membersRoot(forumId) });
      queryClient.invalidateQueries({ queryKey: forumKeys.detail(forumId) });
    },
  });
}

export function useSaveMemberGroups(forumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      groups,
    }: {
      userId: string;
      groups: { group_id: string; role: GroupMemberRole }[];
    }) => putMemberGroups(forumId, userId, groups),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.membersRoot(forumId) });
      queryClient.invalidateQueries({ queryKey: forumKeys.groupsRoot(forumId) });
    },
  });
}

export function useForumAdmins(forumId: string) {
  return useQuery({
    queryKey: forumKeys.admins(forumId),
    queryFn: () => getAdmins(forumId),
    enabled: Boolean(forumId),
    refetchOnWindowFocus: false,
  });
}

export function useSaveForumAdmins(forumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (admins: ForumAdminInput[]) => putAdmins(forumId, admins),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.admins(forumId) });
      queryClient.invalidateQueries({ queryKey: forumKeys.detail(forumId) });
    },
  });
}
