"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { UserAttendanceStatusKey } from "@/services/api/user-attendance";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { useUserAttendanceCalendar } from "../../hooks/useUserAttendanceCalendar";
import { StatusDot } from "../shared/StatusDot";
import {
  buildCalendarGrid,
  CALENDAR_LEGEND_ITEMS,
  shouldShowHours,
  shouldShowStatusLabel,
} from "../../utils/calendar";
import { useAttendanceDirection } from "../../utils/direction";
import { getLocalizedStatusLabel } from "../../utils/i18n";
import { getDotColorStyles } from "../../utils/status-colors";

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

          const colorStyles = day.dotColor
            ? getDotColorStyles(day.dotColor)
            : null;

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
              className={`aspect-square rounded-xl border p-2 flex flex-col items-center justify-between text-center transition-colors ${
                day.isToday
                  ? "border-primary bg-primary/5"
                  : "border-border bg-popover/40"
              }`}
            >
              <span
                className={`text-sm text-foreground w-full ${
                  isRtl ? "text-end" : "text-start"
                }`}
              >
                {day.date}
              </span>

              {showHours && day.hours && (
                <span
                  className="text-[10px] font-medium"
                  style={{ color: colorStyles?.color }}
                  dir="ltr"
                >
                  {day.hours}
                </span>
              )}

              {showLabel && statusLabel && (
                <span
                  className="text-[10px]"
                  style={{ color: colorStyles?.color }}
                >
                  {statusLabel}
                </span>
              )}

              {day.dotColor && (
                <StatusDot dotColor={day.dotColor} className="w-1.5 h-1.5" />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 pt-2 border-t border-border">
        {CALENDAR_LEGEND_ITEMS.map((item) => (
          <div key={item.key} className="flex items-center gap-1.5">
            <StatusDot dotColor={item.dotColor} />
            <span className="text-xs text-muted-foreground">
              {statusT(item.labelKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
