"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "../api/announcements";
import { forumKeys } from "../query-keys";
import type { AnnouncementBody, AnnouncementListParams } from "../types";

export function useAnnouncementsList(params: AnnouncementListParams) {
  return useQuery({
    queryKey: forumKeys.announcements(params),
    queryFn: () => getAnnouncements(params),
    refetchOnWindowFocus: false,
  });
}

export function useAnnouncement(id: string | null) {
  return useQuery({
    queryKey: [...forumKeys.announcementsRoot, "detail", id],
    queryFn: () => getAnnouncement(id as string),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
  });
}

export function useSaveAnnouncement(id?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AnnouncementBody) =>
      id ? updateAnnouncement(id, body) : createAnnouncement(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: forumKeys.announcementsRoot,
      });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: forumKeys.announcementsRoot,
      });
    },
  });
}
