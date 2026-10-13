"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/config/axios-config";
import {
  AdvanceRequestsApi,
  LeaveRequestsApi,
} from "@/services/api/approval-requests";
import {
  HR_APPROVAL_INBOX_COUNTS_QUERY_KEY,
  HR_EMPLOYEE_TASKS_INBOX_COUNTS_QUERY_KEY,
} from "@/modules/hr-inbox/query-keys";

/**
 * Fills the per-tab count cards and the leave/advance tab badges. All counts
 * are fetched on screen mount; after any approve/reject the caller
 * invalidates `[HR_APPROVAL_INBOX_COUNTS_QUERY_KEY]` (and the tasks key) to
 * refresh them.
 */
export function useApprovalInboxCounts() {
  const tasksQuery = useQuery({
    queryKey: [HR_EMPLOYEE_TASKS_INBOX_COUNTS_QUERY_KEY],
    queryFn: async () => {
      const res = await apiClient.get("/admin/employee-tasks/inbox-counts");
      const payload = res.data?.payload || res.data;
      return payload?.total ?? 0;
    },
  });

  const leaveQuery = useQuery({
    queryKey: [HR_APPROVAL_INBOX_COUNTS_QUERY_KEY, "leave"],
    queryFn: async () => {
      const res = await LeaveRequestsApi.inboxCounts();
      const payload = res.data?.payload;
      return payload?.pending_leave_requests ?? payload?.total ?? 0;
    },
  });

  const advanceQuery = useQuery({
    queryKey: [HR_APPROVAL_INBOX_COUNTS_QUERY_KEY, "advance"],
    queryFn: async () => {
      const res = await AdvanceRequestsApi.inboxCounts();
      const payload = res.data?.payload;
      return payload?.pending_advance_requests ?? payload?.total ?? 0;
    },
  });

  return {
    tasksCount: tasksQuery.data ?? 0,
    leaveCount: leaveQuery.data ?? 0,
    advanceCount: advanceQuery.data ?? 0,
    isLoading:
      tasksQuery.isLoading || leaveQuery.isLoading || advanceQuery.isLoading,
  };
}
