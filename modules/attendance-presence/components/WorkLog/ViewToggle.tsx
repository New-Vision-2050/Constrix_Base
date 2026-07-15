"use client";

import React from "react";
import { CalendarDays, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { WorkLogViewMode } from "../../types";

export default function ViewToggle() {
  const t = useTranslations("AttendancePresence");
  const { workLogView, setWorkLogView } = useAttendancePresence();

  const toggle = (view: WorkLogViewMode) => () => setWorkLogView(view);

  return (
    <div className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-black/20 p-1">
      <button
        type="button"
        onClick={toggle("table")}
        title={t("tableView")}
        className={`rounded-lg p-2 transition-all duration-200 ${
          workLogView === "table"
            ? "bg-primary text-primary-foreground shadow-[0_4px_12px_-4px_hsl(var(--primary))]"
            : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
        }`}
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={toggle("calendar")}
        title={t("calendarView")}
        className={`rounded-lg p-2 transition-all duration-200 ${
          workLogView === "calendar"
            ? "bg-primary text-primary-foreground shadow-[0_4px_12px_-4px_hsl(var(--primary))]"
            : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
        }`}
      >
        <CalendarDays size={16} />
      </button>
    </div>
  );
}
