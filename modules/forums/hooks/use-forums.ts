"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveForum,
  createForum,
  getForum,
  getForums,
  restoreForum,
  updateForum,
} from "../api/forums";
import { forumKeys } from "../query-keys";
import type {
  CreateForumBody,
  ForumListParams,
  UpdateForumBody,
} from "../types";

export function useForumsList(params: ForumListParams) {
  return useQuery({
    queryKey: forumKeys.list(params),
    queryFn: () => getForums(params),
    refetchOnWindowFocus: false,
  });
}

export function useForum(forumId: string, enabled = true) {
  return useQuery({
    queryKey: forumKeys.detail(forumId),
    queryFn: () => getForum(forumId),
    enabled: Boolean(forumId) && enabled,
    refetchOnWindowFocus: false,
  });
}

export function useCreateForum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateForumBody) => createForum(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.root });
    },
  });
}

export function useUpdateForum(forumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateForumBody) => updateForum(forumId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.detail(forumId) });
      queryClient.invalidateQueries({ queryKey: forumKeys.root });
    },
  });
}

export function useArchiveForum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (forumId: string) => archiveForum(forumId),
    onSuccess: (_data, forumId) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.detail(forumId) });
      queryClient.invalidateQueries({ queryKey: forumKeys.root });
    },
  });
}

export function useRestoreForum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (forumId: string) => restoreForum(forumId),
    onSuccess: (_data, forumId) => {
      queryClient.invalidateQueries({ queryKey: forumKeys.detail(forumId) });
      queryClient.invalidateQueries({ queryKey: forumKeys.root });
    },
  });
}
