"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { useAttendanceDirection } from "../../utils/direction";
import ViewToggle from "./ViewToggle";
import WorkLogCalendar from "./WorkLogCalendar";
import WorkLogTable from "./WorkLogTable";

export default function WorkLogSection() {
  const t = useTranslations("AttendancePresence");
  const { dir } = useAttendanceDirection();
  const { workLogView } = useAttendancePresence();

  return (
    <div
      className="bg-sidebar rounded-xl border border-border p-4 h-full flex flex-col"
      dir={dir}
    >
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="text-foreground font-medium">{t("workLog")}</h3>
        <ViewToggle />
      </div>

      <div className="flex-1">
        {workLogView === "calendar" ? <WorkLogCalendar /> : <WorkLogTable />}
      </div>
    </div>
  );
}
