"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { formatMonthYear } from "../../utils/calendar";
import { useAttendanceDirection } from "../../utils/direction";

export default function WorkLogMonthPicker() {
  const locale = useLocale();
  const { PrevIcon, NextIcon, isRtl } = useAttendanceDirection();
  const { selectedMonth, setSelectedMonth } = useAttendancePresence();

  const monthLabel = formatMonthYear(selectedMonth, locale);

  const changeMonth = (delta: number) => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + delta, 1),
    );
  };

  return (
    <div className="flex items-center gap-1 rounded-lg bg-popover px-2 py-1 text-foreground">
      <button
        type="button"
        onClick={() => changeMonth(-1)}
        className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Previous month"
      >
        <PrevIcon size={16} />
      </button>

      <div
        className={cn(
          "flex min-w-[7rem] items-center justify-center gap-1 px-1",
          isRtl && "flex-row-reverse",
        )}
      >
        <ChevronDown size={14} className="shrink-0 text-muted-foreground" />
        <span className="text-sm font-medium">{monthLabel}</span>
      </div>

      <button
        type="button"
        onClick={() => changeMonth(1)}
        className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Next month"
      >
        <NextIcon size={16} />
      </button>
    </div>
  );
}
