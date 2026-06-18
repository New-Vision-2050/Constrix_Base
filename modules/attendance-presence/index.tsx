"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { AttendancePresenceProvider } from "./context/AttendancePresenceContext";
import AttendancePresenceTabs from "./components/AttendancePresenceTabs";

export default function AttendancePresenceIndex() {
  const t = useTranslations("AttendancePresence");
  const isRtl = useIsRtl();
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <AttendancePresenceProvider>
      <div className="container mx-auto p-6" dir={dir}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        </div>
        <AttendancePresenceTabs />
      </div>
    </AttendancePresenceProvider>
  );
}
