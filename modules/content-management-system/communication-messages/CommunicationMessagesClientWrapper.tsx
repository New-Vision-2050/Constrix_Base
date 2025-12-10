"use client";

import dynamic from "next/dynamic";

const CommunicationMessagesView = dynamic(() => import("./index"), {
  ssr: false,
});

export default function CommunicationMessagesClientWrapper() {
  return <CommunicationMessagesView />;
}
