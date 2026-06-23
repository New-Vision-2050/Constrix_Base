"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { UserAttendanceStatusKey } from "@/services/api/user-attendance";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { useUserAttendanceCalendar } from "../../hooks/useUserAttendanceCalendar";
import {
  buildCalendarGrid,
  CALENDAR_LEGEND_ITEMS,
  shouldShowHours,
  shouldShowStatusLabel,
} from "../../utils/calendar";
import { useAttendanceDirection } from "../../utils/direction";
import { getLocalizedStatusLabel } from "../../utils/i18n";

const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

type CalendarStatusKey = UserAttendanceStatusKey;

const CALENDAR_STATUS_CLASSES: Record<
  CalendarStatusKey,
  { cell: string; dayNumber: string; label: string; dot: string }
> = {
  off: {
    cell: "bg-secondary/45 border-secondary-foreground/20",
    dayNumber: "text-foreground/80",
    label: "text-secondary-foreground",
    dot: "bg-secondary-foreground/75",
  },
  absent: {
    cell: "bg-destructive/15 border-destructive/25",
    dayNumber: "text-foreground",
    label: "text-destructive",
    dot: "bg-destructive",
  },
  present: {
    cell: "bg-chart-2/15 border-chart-2/25",
    dayNumber: "text-foreground",
    label: "text-chart-2",
    dot: "bg-chart-2",
  },
  late: {
    cell: "bg-chart-3/15 border-chart-3/25",
    dayNumber: "text-foreground",
    label: "text-chart-3",
    dot: "bg-chart-3",
  },
  leave: {
    cell: "bg-chart-4/15 border-chart-4/25",
    dayNumber: "text-foreground",
    label: "text-chart-4",
    dot: "bg-chart-4",
  },
  required: {
    cell: "bg-chart-1/15 border-chart-1/25",
    dayNumber: "text-foreground",
    label: "text-chart-1",
    dot: "bg-chart-1",
  },
};

const LEGEND_DOT_CLASS: Record<string, string> = {
  late: "bg-chart-3",
  absent: "bg-destructive",
  holiday: "bg-secondary-foreground/75",
  required: "bg-chart-1",
};

function getCalendarStatusClasses(
  statusKey?: string,
  isToday = false,
) {
  const key =
    statusKey && statusKey in CALENDAR_STATUS_CLASSES
      ? (statusKey as CalendarStatusKey)
      : "off";

  const styles = CALENDAR_STATUS_CLASSES[key];

  return {
    ...styles,
    cell: cn(
      styles.cell,
      isToday && "border-primary ring-1 ring-primary/30 border-2",
    ),
  };
}

export default function WorkLogCalendar() {
  const t = useTranslations("AttendancePresence");
  const statusT = useTranslations("AttendancePresence.status");
  const weekdaysT = useTranslations("AttendancePresence.weekdays");
  const locale = useLocale();
  const { dir, isRtl } = useAttendanceDirection();
  const { selectedMonth } = useAttendancePresence();

  const month = selectedMonth.getMonth() + 1;
  const year = selectedMonth.getFullYear();
  const { data, isLoading, isError } = useUserAttendanceCalendar(month, year);

  const calendarDays = buildCalendarGrid(data?.days ?? []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[320px] text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[320px] text-destructive">
        {t("loadError")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" dir={dir}>
      <div className="grid grid-cols-7 gap-2">
        {WEEKDAY_KEYS.map((key) => (
          <div
            key={key}
            className="text-center text-xs text-muted-foreground py-1"
          >
            {weekdaysT(key)}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          if (day.date === null) {
            return <div key={`empty-${index}`} />;
          }

          const cellClasses = getCalendarStatusClasses(
            day.statusKey,
            day.isToday,
          );

          const showHours = shouldShowHours(day.statusKey, day.hours);
          const showLabel = shouldShowStatusLabel(day.statusKey, day.hours);
          const statusLabel =
            day.statusKey && day.statusLabel
              ? getLocalizedStatusLabel(
                  day.statusKey as UserAttendanceStatusKey,
                  day.statusLabel,
                  locale,
                  statusT,
                )
              : day.statusLabel;

          return (
            <div
              key={day.isoDate ?? day.date}
              className={cn(
                "aspect-square rounded-xl border p-2 flex flex-col items-center justify-between text-center transition-colors",
                cellClasses.cell,
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium w-full",
                  isRtl ? "text-end" : "text-start",
                  cellClasses.dayNumber,
                )}
              >
                {day.date}
              </span>

              {showHours && day.hours ? (
                <span
                  className={cn("text-[10px] font-semibold", cellClasses.label)}
                  dir="ltr"
                >
                  {day.hours}
                </span>
              ) : null}

              {showLabel && statusLabel ? (
                <span
                  className={cn("text-[10px] font-medium", cellClasses.label)}
                >
                  {statusLabel}
                </span>
              ) : null}

              <span
                className={cn(
                  "w-1.5 h-1.5 shrink-0 rounded-full",
                  cellClasses.dot,
                )}
              />
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 pt-2 border-t border-border">
        {CALENDAR_LEGEND_ITEMS.map((item) => (
          <div key={item.key} className="flex items-center gap-1.5">
            <span
              className={cn(
                "w-2 h-2 shrink-0 rounded-full",
                LEGEND_DOT_CLASS[item.labelKey] ?? "bg-muted-foreground",
              )}
            />
            <span className="text-xs text-muted-foreground">
              {statusT(item.labelKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
