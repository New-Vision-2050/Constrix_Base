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
    <div className="flex items-center gap-1 bg-popover rounded-lg p-1">
      <button
        type="button"
        onClick={toggle("table")}
        title={t("tableView")}
        className={`p-2 rounded-md transition-colors ${
          workLogView === "table"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={toggle("calendar")}
        title={t("calendarView")}
        className={`p-2 rounded-md transition-colors ${
          workLogView === "calendar"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <CalendarDays size={16} />
      </button>
    </div>
  );
}
