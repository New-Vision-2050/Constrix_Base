"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Clock, Pencil } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { useUserConstraintToday } from "../../hooks/useAttendanceActions";
import { useCurrentDateTime } from "../../hooks/useCurrentDateTime";
import { useAttendanceDirection } from "../../utils/direction";
import {
  formatApiTime,
  getActiveAttendance,
  getActiveWorkPeriod,
  getAttendanceActionState,
  getLatestAttendanceRecord,
  getPeriodShiftProgress,
} from "../../utils/attendance";
import { formatDurationHoursMinutes } from "../../utils/time";
import AttendanceActionDialogs from "./AttendanceActionDialogs";

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
  const { data: constraintData, isLoading } = useUserConstraintToday();

  const apiPeriods = constraintData?.work_rules.all_work_periods ?? [];
  const activeApiPeriod = getActiveWorkPeriod(apiPeriods);

  useEffect(() => {
    const activeIndex = apiPeriods.findIndex((period) => period.is_active);
    if (activeIndex >= 0) {
      setActivePeriod(`period-${activeIndex + 1}`);
    }
  }, [apiPeriods, setActivePeriod]);

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

  const actionPeriod = activeApiPeriod ?? selectedApiPeriod;
  const { showButton, isClockOut, canPerform } =
    getAttendanceActionState(actionPeriod);

  const activeAttendance = getActiveAttendance(actionPeriod?.attendance);
  const latestAttendance = getLatestAttendanceRecord(selectedApiPeriod);

  const shiftProgress = selectedApiPeriod
    ? getPeriodShiftProgress(now, selectedApiPeriod)
    : null;

  const workedMinutes = selectedApiPeriod
    ? Math.round(selectedApiPeriod.total_hours_present * 60)
    : 0;
  const goalHours = selectedApiPeriod?.total_work_hours ?? 9;
  const remainingLabel = `${formatDurationHoursMinutes(shiftProgress?.remainingMinutes ?? 0)} ${t("hoursShort")}`;
  const progress = shiftProgress?.progress ?? 0;
  const workedHoursLabel = formatDurationHoursMinutes(workedMinutes);

  const clockInDisplay = activeAttendance?.clock_in_time
    ? formatApiTime(activeAttendance.clock_in_time, locale).display
    : latestAttendance?.clock_in_time
      ? formatApiTime(latestAttendance.clock_in_time, locale).display
      : "---";

  const clockOutDisplay = activeAttendance?.clock_out_time
    ? formatApiTime(activeAttendance.clock_out_time, locale).display
    : latestAttendance?.clock_out_time
      ? formatApiTime(latestAttendance.clock_out_time, locale).display
      : "---";

  const startTimeDisplay = selectedApiPeriod
    ? formatApiTime(selectedApiPeriod.start_time, locale).display
    : "---";

  const endTimeDisplay = selectedApiPeriod
    ? formatApiTime(selectedApiPeriod.end_time, locale).display
    : "---";

  const hasTableData = useMemo(() => {
    if (workedMinutes > 0) return true;
    if (activeAttendance?.clock_in_time || activeAttendance?.clock_out_time) {
      return true;
    }
    if (latestAttendance?.clock_in_time || latestAttendance?.clock_out_time) {
      return true;
    }

    return Boolean(
      selectedApiPeriod?.attendance.some(
        (record) =>
          record.clock_in_time ||
          record.clock_out_time ||
          record.total_hours_present > 0,
      ),
    );
  }, [
    activeAttendance,
    latestAttendance,
    selectedApiPeriod?.attendance,
    workedMinutes,
  ]);

  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const handleRequestPermission = async () => {
    setIsRequestingPermission(true);
    try {
      toast.info(t("underDevelopment"));
    } finally {
      setIsRequestingPermission(false);
    }
  };

  return (
    <div
      className="bg-sidebar rounded-xl border border-border p-4 h-auto w-full"
      dir={dir}
    >
      <h3 className="text-foreground font-medium mb-4">{t("todayLog")}</h3>

      {apiPeriods.length > 1 ? (
        <div className="flex gap-1 mb-4">
          {periods.slice(0, apiPeriods.length).map((period) => (
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
      ) : null}

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

      {hasTableData ? (
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
              {clockOutDisplay}
            </div>
            <div className="p-2 text-start" dir="ltr">
              {workedMinutes > 0 ? workedHoursLabel : "---"}
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        {showButton && actionPeriod && constraintData?.work_rules.location_work ? (
          <AttendanceActionDialogs
            workPeriod={actionPeriod}
            locationWork={constraintData.work_rules.location_work}
            disabled={!canPerform}
          />
        ) : showButton ? (
          <Button className="w-full h-11" disabled>
            {isClockOut ? t("registerDeparture") : t("registerAttendance")}
          </Button>
        ) : null}
        {!isLoading && !showButton ? (
          <p className="text-xs text-center text-muted-foreground">
            {constraintData?.work_rules.reason ?? t("cannotRegisterNow")}
          </p>
        ) : null}
        <Button
          variant="outline"
          className="w-full h-10"
          loading={isRequestingPermission}
          onClick={handleRequestPermission}
        >
          <Pencil size={16} className="me-2" />
          {t("requestPermission")}
        </Button>
      </div>
    </div>
  );
}
