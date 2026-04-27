"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useEcho } from "@/hooks/use-echo";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import { CRM_INBOX_PENDING_COUNT_QUERY_KEY } from "@/components/icons/crm-inbox";
import { CRM_INBOX_LIST_QUERY_KEY } from "@/modules/crm-settings/query-keys";
import {
  CLIENT_REQUEST_INBOX_ECHO_EVENTS,
  getClientRequestUserChannelName,
} from "@/modules/crm-settings/inbox/components/client-request-inbox-realtime";
import { describeClientRequestBroadcast } from "@/modules/crm-settings/inbox/utils/describe-client-request-broadcast";


export function ClientRequestInboxEchoSubscriber() {
  const userId = useAuthStore((s) => s.user?.id);
  const { echo } = useEcho();
  const queryClient = useQueryClient();
  const t = useTranslations("clientRequests.inbox");

  useEffect(() => {
    if (!echo || !userId) return;

    const channelName = getClientRequestUserChannelName(userId);
    const channel = echo.private(channelName);

    const invalidateInbox = () => {
      void queryClient.invalidateQueries({ queryKey: [CRM_INBOX_LIST_QUERY_KEY] });
      void queryClient.invalidateQueries({
        queryKey: [...CRM_INBOX_PENDING_COUNT_QUERY_KEY],
      });
    };

    const notify = (kind: "created" | "status") => (payload: unknown) => {
      invalidateInbox();
      const { title, description } = describeClientRequestBroadcast(payload);
      const fallback =
        kind === "created"
          ? t("toastRealtimeNewRequest")
          : t("toastRealtimeRequestUpdated");
      toast.info(title ?? fallback, {
        description: description ?? undefined,
      });
    };

    const [createdEvent, statusEvent] = CLIENT_REQUEST_INBOX_ECHO_EVENTS;
    const onCreated = notify("created");
    const onStatusChanged = notify("status");

    channel.listen(createdEvent, onCreated);
    channel.listen(statusEvent, onStatusChanged);

    return () => {
      channel.stopListening(createdEvent, onCreated);
      channel.stopListening(statusEvent, onStatusChanged);
      echo.leave(channelName);
    };
  }, [echo, userId, queryClient, t]);

  return null;
}
