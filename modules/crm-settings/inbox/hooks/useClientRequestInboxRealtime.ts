"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEcho } from "@/hooks/use-echo";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import { CRM_INBOX_PENDING_COUNT_QUERY_KEY } from "@/components/icons/crm-inbox";
import { CRM_INBOX_LIST_QUERY_KEY } from "@/modules/crm-settings/query-keys";
import {
  CLIENT_REQUEST_INBOX_ECHO_EVENTS,
  getClientRequestUserChannelName,
} from "@/modules/crm-settings/inbox/client-request-inbox-realtime";

/**
 * Subscribes to `client-request.{user_id}` and refetches inbox list + badge count
 * when `client-request.created` or `client-request.status-changed` is broadcast.
 */
export function useClientRequestInboxRealtime() {
  const userId = useAuthStore((s) => s.user?.id);
  const { echo } = useEcho();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!echo || !userId) return;

    const channelName = getClientRequestUserChannelName(userId);
    const invalidate = () => {
      void queryClient.invalidateQueries({
        queryKey: [CRM_INBOX_LIST_QUERY_KEY],
      });
      void queryClient.invalidateQueries({
        queryKey: CRM_INBOX_PENDING_COUNT_QUERY_KEY,
      });
    };

    const channel = echo.private(channelName);
    for (const event of CLIENT_REQUEST_INBOX_ECHO_EVENTS) {
      channel.listen(event, invalidate);
    }

    return () => {
      for (const event of CLIENT_REQUEST_INBOX_ECHO_EVENTS) {
        channel.stopListening(event, invalidate);
      }
      echo.leave(channelName);
    };
  }, [echo, userId, queryClient]);
}
