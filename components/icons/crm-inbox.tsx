"use client";

import { useEffect, useRef, useState } from "react";
import { ClientRequestsApi } from "@/services/api/client-requests";
import { useEcho } from "@/hooks/use-echo";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import { Badge, Box } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import { Inbox } from "lucide-react";

/** One-shot pulse when the badge count changes (notify feedback). */
const notifyPulse = keyframes`
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(244, 67, 54, 0));
  }
  35% {
    transform: scale(1.14);
    filter: drop-shadow(0 0 8px rgba(244, 67, 54, 0.75));
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 rgba(244, 67, 54, 0));
  }
`;

export const CRM_INBOX_PENDING_COUNT_QUERY_KEY = [
  "crm-inbox-pending-count",
] as const;

export const CRM_CLIENT_REQUEST_INBOX_EVENTS = [
  ".client-request.created",
  ".client-request.status-changed",
] as const;

function CrmInboxIconWithCount() {
  const userId = useAuthStore((s) => s.user?.id);
  const { echo } = useEcho();

  const pendingCountQuery = useQuery({
    queryKey: CRM_INBOX_PENDING_COUNT_QUERY_KEY,
    queryFn: async () => {
      const res = await ClientRequestsApi.list({
        page: 1,
        per_page: 1,
        status_client_request: "pending",
      });
      return res.data.pagination?.result_count ?? 0;
    },
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!echo || !userId) return;

    const channelName = `client-request.${userId}`;
    const refetch = () => {
      void pendingCountQuery.refetch();
    };

    const channel = echo.private(channelName);
    for (const event of CRM_CLIENT_REQUEST_INBOX_EVENTS) {
      channel.listen(event, refetch);
    }

    return () => {
      for (const event of CRM_CLIENT_REQUEST_INBOX_EVENTS) {
        channel.stopListening(event, refetch);
      }
      echo.leave(channelName);
    };
  }, [echo, userId, pendingCountQuery.refetch]);

  const count = pendingCountQuery.data ?? 0;
  const prevCountRef = useRef<number | null>(null);
  const [pulseNotify, setPulseNotify] = useState(false);

  useEffect(() => {
    const prev = prevCountRef.current;
    prevCountRef.current = count;
    if (prev === null) return;
    if (prev === count) return;
    setPulseNotify(true);
    const t = window.setTimeout(() => setPulseNotify(false), 780);
    return () => window.clearTimeout(t);
  }, [count]);

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        animation: pulseNotify ? `${notifyPulse} 0.78s ease-out` : "none",
        willChange: pulseNotify ? "transform" : "auto",
      }}
    >
      <Badge
        badgeContent={count > 0 ? count : undefined}
        color="error"
        invisible={count === 0}
        max={99}
      >
        <Inbox className="h-5 w-5" />
      </Badge>
    </Box>
  );
}

export default CrmInboxIconWithCount;
