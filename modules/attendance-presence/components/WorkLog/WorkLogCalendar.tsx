"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { UserAttendanceStatusKey } from "@/services/api/user-attendance";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { useUserAttendanceCalendar } from "../../hooks/useUserAttendanceCalendar";
import {
  buildCalendarGrid,
  buildCalendarLegend,
  shouldShowHours,
  shouldShowStatusLabel,
} from "../../utils/calendar";
import { getCalendarDayCellStyles } from "../../utils/status-colors";
import { useAttendanceDirection } from "../../utils/direction";
import { getLocalizedStatusLabel } from "../../utils/i18n";

const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

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
  const legendItems = buildCalendarLegend(data?.days ?? []);

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
            className="py-1 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80"
          >
            {weekdaysT(key)}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          if (day.date === null) {
            return <div key={`empty-${index}`} />;
          }

          const cellStyles = getCalendarDayCellStyles(
            day.statusKey,
            day.dotColor,
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
                "group/day relative flex aspect-square flex-col items-center justify-between overflow-hidden rounded-xl border p-2 text-center transition-all duration-200 hover:-translate-y-0.5 hover:brightness-125",
                day.isToday && "ring-2 ring-primary/60 ring-offset-0",
              )}
              style={{
                backgroundColor: cellStyles.backgroundColor,
                borderColor: cellStyles.borderColor,
                boxShadow: day.isToday
                  ? `0 0 0 1px ${cellStyles.dotColor}, 0 8px 20px -10px ${cellStyles.dotColor}`
                  : undefined,
              }}
            >
              <span
                className={cn(
                  "w-full text-sm font-semibold",
                  isRtl ? "text-end" : "text-start",
                )}
                style={{ color: cellStyles.dayNumberColor }}
              >
                {day.date}
              </span>

              {showHours && day.hours ? (
                <span
                  className="text-[10px] font-bold tracking-tight"
                  style={{ color: cellStyles.labelColor }}
                  dir="ltr"
                >
                  {day.hours}
                </span>
              ) : null}

              {showLabel && statusLabel ? (
                <span
                  className="text-[10px] font-medium"
                  style={{ color: cellStyles.labelColor }}
                >
                  {statusLabel}
                </span>
              ) : null}

              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-200 group-hover/day:scale-150"
                style={{
                  backgroundColor: cellStyles.dotColor,
                  boxShadow: `0 0 6px ${cellStyles.dotColor}`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
        {legendItems.map((item) => {
          const label = getLocalizedStatusLabel(
            item.statusKey as UserAttendanceStatusKey,
            item.statusLabel,
            locale,
            statusT,
          );

          return (
            <div
              key={item.statusKey}
              className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: item.dotColor,
                  boxShadow: `0 0 6px ${item.dotColor}`,
                }}
              />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
