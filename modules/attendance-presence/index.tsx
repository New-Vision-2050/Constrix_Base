"use client";

import React from "react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { AttendancePresenceProvider } from "./context/AttendancePresenceContext";
import AttendancePresenceTabs from "./components/AttendancePresenceTabs";

export default function AttendancePresenceIndex() {
  const isRtl = useIsRtl();
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <AttendancePresenceProvider>
      <div className="container mx-auto p-6" dir={dir}>
        <AttendancePresenceTabs />
      </div>
    </AttendancePresenceProvider>
  );
}
