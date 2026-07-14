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
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-sidebar p-4"
      style={{
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 18px 40px -24px rgba(0,0,0,0.7)",
      }}
      dir={dir}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 start-1/3 h-56 w-56 rounded-full bg-primary/20 opacity-30 blur-3xl"
      />

      <div className="relative z-10 mb-4 flex items-center justify-between gap-3">
        <h3 className="flex shrink-0 items-center gap-2.5 text-base font-semibold text-foreground">
          <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-primary to-primary/40" />
          {t("workLog")}
        </h3>
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

      <div className="relative z-10 flex-1">
        {workLogView === "calendar" ? <WorkLogCalendar /> : <WorkLogTable />}
      </div>
    </div>
  );
}
