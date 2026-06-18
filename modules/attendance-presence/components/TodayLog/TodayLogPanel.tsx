"use client";

import React, { useMemo } from "react";
import { Clock, Pencil } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { MOCK_WORK_PERIODS } from "../../constants/mock-data";
import { useUserConstraintToday } from "../../hooks/useAttendanceActions";
import { useCurrentDateTime } from "../../hooks/useCurrentDateTime";
import { useUserAttendanceCalendar } from "../../hooks/useUserAttendanceCalendar";
import { useAttendanceDirection } from "../../utils/direction";
import {
  formatApiTime,
  getActiveAttendance,
  getActiveWorkPeriod,
} from "../../utils/attendance";
import {
  formatDurationHoursMinutes,
  getShiftRemainingMinutes,
  getShiftTotalMinutes,
  parseDurationFormatted,
} from "../../utils/time";
import AttendanceActionDialogs from "./AttendanceActionDialogs";

function getTodayDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function CircularProgress({
  timeLabel,
  subtitle,
  progress,
}: {
  timeLabel: string;
  subtitle: string;
  progress: number;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const offset = circumference * (1 - clampedProgress);

  return (
    <div className="relative w-36 h-36 mx-auto my-4">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          className="stroke-border"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          className="stroke-primary"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground" dir="ltr">
          {timeLabel}
        </span>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
    </div>
  );
}

export default function TodayLogPanel() {
  const t = useTranslations("AttendancePresence");
  const locale = useLocale();
  const { dir } = useAttendanceDirection();
  const { activePeriod, setActivePeriod } = useAttendancePresence();
  const now = useCurrentDateTime();

  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const { data: calendarData } = useUserAttendanceCalendar(month, year);
  const { data: constraintData } = useUserConstraintToday();

  const apiPeriods = constraintData?.work_rules.all_work_periods ?? [];
  const activeApiPeriod = getActiveWorkPeriod(apiPeriods);
  const activeAttendance = getActiveAttendance(activeApiPeriod?.attendance);
  const isClockOut = Boolean(activeAttendance);
  const showAttendanceButton = Boolean(activeApiPeriod?.is_active);
  const canPerformAction = isClockOut || Boolean(activeApiPeriod?.can_clock_in);

  const periods = useMemo(() => {
    if (apiPeriods.length > 0) {
      return apiPeriods.map((period, index) => ({
        id: `period-${index + 1}`,
        label:
          index === 0
            ? t("period1")
            : index === 1
              ? t("period2")
              : t("period3"),
        apiIndex: index,
      }));
    }

    return [
      { id: "period-1", label: t("period1"), apiIndex: 0 },
      { id: "period-2", label: t("period2"), apiIndex: 1 },
      { id: "period-3", label: t("period3"), apiIndex: 2 },
    ];
  }, [apiPeriods, t]);

  const selectedApiPeriod =
    apiPeriods[
      periods.find((period) => period.id === activePeriod)?.apiIndex ?? 0
    ] ?? activeApiPeriod;

  const mockPeriod = MOCK_WORK_PERIODS.find((period) => period.id === activePeriod);

  const todayDay = useMemo(() => {
    const todayKey = getTodayDateKey(now);

    return calendarData?.days.find((day) => day.date === todayKey);
  }, [calendarData?.days, now]);

  const workedMinutes = selectedApiPeriod
    ? Math.round(selectedApiPeriod.total_hours_present * 60)
    : parseDurationFormatted(todayDay?.duration_formatted);

  const goalHours = selectedApiPeriod?.total_work_hours ?? mockPeriod?.goalHours ?? 9;

  const remainingMinutes = mockPeriod
    ? getShiftRemainingMinutes(now, mockPeriod)
    : 0;
  const totalShiftMinutes = mockPeriod ? getShiftTotalMinutes(mockPeriod) : 1;
  const elapsedMinutes = totalShiftMinutes - remainingMinutes;
  const remainingLabel = `${formatDurationHoursMinutes(remainingMinutes)} ${t("hoursShort")}`;
  const progress =
    totalShiftMinutes > 0 ? elapsedMinutes / totalShiftMinutes : 0;
  const workedHoursLabel = formatDurationHoursMinutes(workedMinutes);

  const clockInDisplay = activeAttendance?.clock_in_time
    ? formatApiTime(activeAttendance.clock_in_time, locale).display
    : selectedApiPeriod?.attendance.at(-1)?.clock_in_time
      ? formatApiTime(
          selectedApiPeriod.attendance.at(-1)!.clock_in_time!,
          locale,
        ).display
      : "---";

  const startTimeDisplay = selectedApiPeriod
    ? formatApiTime(selectedApiPeriod.start_time, locale).display
    : mockPeriod?.startTime;

  const endTimeDisplay = selectedApiPeriod
    ? formatApiTime(selectedApiPeriod.end_time, locale).display
    : mockPeriod?.endTime;

  return (
    <div
      className="bg-sidebar rounded-xl border border-border p-4 h-full flex flex-col"
      dir={dir}
    >
      <h3 className="text-foreground font-medium mb-4">{t("todayLog")}</h3>

      <div className="flex gap-1 mb-4">
        {periods.map((period) => (
          <button
            key={period.id}
            type="button"
            onClick={() => setActivePeriod(period.id)}
            className={`flex-1 text-xs py-2 px-1 rounded-lg transition-colors ${
              activePeriod === period.id
                ? "bg-primary/20 text-primary border border-primary/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      <CircularProgress
        timeLabel={remainingLabel}
        subtitle={t("timeRemaining")}
        progress={progress}
      />

      <div className="text-sm text-muted-foreground mb-3">
        {t("todayGoalLabel", { hours: goalHours.toFixed(1) })}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center">
          <div className="text-primary text-xs flex items-center justify-center gap-1 mb-1">
            <Clock size={12} />
            {t("checkIn")}
          </div>
          <div className="text-sm text-foreground" dir="ltr">
            {startTimeDisplay}
          </div>
        </div>
        <div className="text-center">
          <div className="text-primary text-xs flex items-center justify-center gap-1 mb-1">
            <Clock size={12} />
            {t("checkOut")}
          </div>
          <div className="text-sm text-foreground" dir="ltr">
            {endTimeDisplay}
          </div>
        </div>
        <div className="text-center">
          <div className="text-primary text-xs flex items-center justify-center gap-1 mb-1">
            <Clock size={12} />
            {t("workHours")}
          </div>
          <div className="text-sm text-foreground" dir="ltr">
            {workedHoursLabel}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden mb-4 text-sm">
        <div className="grid grid-cols-4 bg-popover text-muted-foreground text-xs">
          <div className="p-2 text-start">{t("date")}</div>
          <div className="p-2 text-start">{t("checkIn")}</div>
          <div className="p-2 text-start">{t("departure")}</div>
          <div className="p-2 text-start">{t("workHours")}</div>
        </div>
        <div className="grid grid-cols-4 text-foreground text-xs">
          <div className="p-2 text-start">{t("today")}</div>
          <div className="p-2 text-start" dir="ltr">
            {clockInDisplay}
          </div>
          <div className="p-2 text-start" dir="ltr">
            {activeAttendance?.clock_out_time ?? "---"}
          </div>
          <div className="p-2 text-start" dir="ltr">
            {workedMinutes > 0 ? workedHoursLabel : "---"}
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-2">
        {showAttendanceButton && constraintData?.work_rules.location_work ? (
          <AttendanceActionDialogs
            isClockOut={isClockOut}
            startTime={selectedApiPeriod?.start_time ?? "08:30"}
            locationWork={constraintData.work_rules.location_work}
            disabled={!canPerformAction}
          />
        ) : showAttendanceButton ? (
          <Button className="w-full h-11" disabled>
            {t("registerAttendance")}
          </Button>
        ) : null}
        <Button variant="outline" className="w-full h-10">
          <Pencil size={16} className="me-2" />
          {t("requestPermission")}
        </Button>
      </div>
    </div>
  );
}
