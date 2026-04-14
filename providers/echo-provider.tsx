"use client";

import React, { createContext, useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { toast } from "sonner";
import { ClientRequestInboxEchoSubscriber } from "@/modules/crm-settings/inbox/components/ClientRequestInboxEchoSubscriber";

export interface EchoContextValue {
  echo: Echo<"reverb">;
  companyId: string;
  companyChannelName: string;
}

export const EchoContext = createContext<EchoContextValue | null>(null);

interface ResourceSharedPayload {
  id: string;
  shareable_type: string;
  shareable_id: string;
  owner_company_id: string;
  owner_company_name: string;
  shared_with_company_id: string;
  shared_with_company_name: string;
  status: string;
  resource_name: string;
  shared_by: { id: string | null; name: string };
  notes: string | null;
  created_at: string | null;
  notification_type: "resource_share";
}

export function EchoProvider({
  children,
  companyId,
}: {
  children: React.ReactNode;
  companyId: string;
}) {
  const [echoInstance, setEchoInstance] = useState<Echo<"reverb"> | null>(null);

  useEffect(() => {
    // window.Pusher must be set before Echo initialization (required by laravel-echo internals)
    (window as unknown as { Pusher: typeof Pusher }).Pusher = Pusher;

    const wsHost = process.env.NEXT_PUBLIC_API_BASE_URL
      ? new URL(process.env.NEXT_PUBLIC_API_BASE_URL).hostname
      : window.location.hostname;

    const instance = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_KEY  ,//
      wsHost: wsHost|| "core-be-dev.constrix-nv.com",
      wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ? Number(process.env.NEXT_PUBLIC_REVERB_PORT) : 80,
      wssPort: process.env.NEXT_PUBLIC_REVERB_WSS_PORT ? Number(process.env.NEXT_PUBLIC_REVERB_WSS_PORT) : 443,
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_FORCE_TLS ?? "true") === "true",
      enabledTransports: ["ws", "wss"],
      encrypted: true,
      disableStats: true,
    });

    console.log("[Echo] Initializing Echo with config:", {
      wsHost,
      wsPort: instance.connector.pusher.config.wsPort,
      wssPort: instance.connector.pusher.config.wssPort,
      forceTLS: instance.connector.pusher.config.forceTLS,

      companyId,
      companyChannelName: `company.${companyId}`,
    });

    instance.connector.pusher.connection.bind("connected", () => {
      console.log("[Echo] ✅ WebSocket connected to", wsHost);
    });

    // Log every incoming message across all channels
    instance.connector.pusher.bind_global(
      (eventName: string, data: unknown) => {
        console.log("[Echo] 📨 Event:", eventName, data);
      },
    );

    instance.connector.pusher.connection.bind("disconnected", () => {
      console.log("[Echo] ❌ WebSocket disconnected from", wsHost);
    });

    instance.connector.pusher.connection.bind("error", (err: unknown) => {
      console.error("[Echo] ⚠️ WebSocket error:", err);
    });

    setEchoInstance(instance);

    // Subscribe to connection-test channel and log all events
    instance
      .channel("connection-test")
      .listenToAll((eventName: string, data: unknown) => {
        console.log("[Echo] 📡 [connection-test]", eventName, data);
      });

    // Subscribe to company channel and log all events
    const companyChannel = `company.${companyId}`;
    instance
      .channel(companyChannel)
      .listenToAll((eventName: string, data: unknown) => {
        console.log(`[Echo] 📡 [${companyChannel}]`, eventName, data);
      })
      .listen(".resource.shared", (e: ResourceSharedPayload) => {
        toast.info(`${e.shared_by.name} shared "${e.resource_name}" with you`, {
          description: [
            e.owner_company_name,
            e.notes ? `Note: ${e.notes}` : null,
          ]
            .filter(Boolean)
            .join(" · "),
        });
      });

    return () => {
      instance.leave("connection-test");
      instance.leave(companyChannel);
      instance.disconnect();
    };
  }, []);

  if (!echoInstance) return <>{children}</>;

  return (
    <EchoContext.Provider
      value={{
        echo: echoInstance,
        companyId,
        companyChannelName: `company.${companyId}`,
      }}
    >
      <ClientRequestInboxEchoSubscriber />
      {children}
    </EchoContext.Provider>
  );
}
