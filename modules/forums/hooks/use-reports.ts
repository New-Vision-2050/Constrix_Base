"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getReports, resolveReport } from "../api/reports";
import { getActivity } from "../api/activity";
import { forumKeys } from "../query-keys";
import type {
  ActivityListParams,
  ReportAction,
  ReportListParams,
} from "../types";

export function useReportsList(
  forumId: string,
  params: ReportListParams,
  enabled = true,
) {
  return useQuery({
    queryKey: forumKeys.reports(forumId, params),
    queryFn: () => getReports(forumId, params),
    enabled: Boolean(forumId) && enabled,
    refetchOnWindowFocus: false,
  });
}

export function useResolveReport(forumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reportId,
      action,
      note,
    }: {
      reportId: string;
      action: ReportAction;
      note: string;
    }) => resolveReport(forumId, reportId, { action, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forumKeys.reportsRoot(forumId) });
      queryClient.invalidateQueries({ queryKey: forumKeys.detail(forumId) });
    },
  });
}

export function useActivityList(forumId: string, params: ActivityListParams) {
  return useQuery({
    queryKey: forumKeys.activity(forumId, params),
    queryFn: () => getActivity(forumId, params),
    enabled: Boolean(forumId),
    refetchOnWindowFocus: false,
  });
}
