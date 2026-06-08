"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEcho } from "@/hooks/use-echo";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import { HR_EMPLOYEE_TASKS_INBOX_QUERY_KEY } from "@/modules/hr-inbox/query-keys";

export function HrInboxEchoSubscriber({
  onRefresh,
}: {
  onRefresh?: () => void;
}) {
  const userId = useAuthStore((s) => s.user?.id);
  const echo = useEcho();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!echo || !userId) return;

    const channelName = `employee-task.inbox-counts.${userId}`;
    const channel = echo.echo.private(channelName);

    const handler = () => {
      void queryClient.invalidateQueries({
        queryKey: [HR_EMPLOYEE_TASKS_INBOX_QUERY_KEY],
      });
      void queryClient.invalidateQueries({
        queryKey: ["widgets"],
      });
      onRefresh?.();
    };

    channel.listen(".employee-task.inbox-counts", handler);

    return () => {
      channel.stopListening(".employee-task.inbox-counts", handler);
      echo.echo.leave(channelName);
    };
  }, [echo, userId, queryClient, onRefresh]);

  return null;
}
