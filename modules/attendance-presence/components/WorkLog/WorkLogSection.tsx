"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { useAttendanceDirection } from "../../utils/direction";
import ViewToggle from "./ViewToggle";
import WorkLogCalendar from "./WorkLogCalendar";
import WorkLogMonthPicker from "./WorkLogMonthPicker";
import WorkLogTable from "./WorkLogTable";

export default function WorkLogSection() {
  const t = useTranslations("AttendancePresence");
  const { dir, isRtl } = useAttendanceDirection();
  const { workLogView } = useAttendancePresence();

  return (
    <div
      className="bg-sidebar rounded-xl border border-border p-4 h-full flex flex-col"
      dir={dir}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="shrink-0 font-medium text-foreground">{t("workLog")}</h3>
        <div
          className={cn(
            "flex items-center gap-2",
            isRtl && "flex-row-reverse",
          )}
        >
          <ViewToggle />
          <WorkLogMonthPicker />
        </div>
      </div>

      <div className="flex-1">
        {workLogView === "calendar" ? <WorkLogCalendar /> : <WorkLogTable />}
      </div>
    </div>
  );
}
