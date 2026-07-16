"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { useUserConstraintToday } from "../../hooks/useAttendanceActions";
import { useCurrentDateTime } from "../../hooks/useCurrentDateTime";
import { useAttendanceDirection } from "../../utils/direction";
import {
  buildWorkPeriodTabs,
  formatApiTime,
  getActiveAttendance,
  getActiveWorkPeriod,
  getAttendanceActionState,
  getLatestAttendanceRecord,
  getPeriodShiftProgress,
  getWorkPeriodByTabId,
} from "../../utils/attendance";
import { formatDurationHoursMinutes } from "../../utils/time";
import AttendanceActionDialogs from "./AttendanceActionDialogs";
import HappyHolidayScreen from "./HappyHolidayScreen";
import {
  CheckInActionIcon,
  CheckOutActionIcon,
  CheckInStatIcon,
  CheckOutStatIcon,
  ElapsedTimeDisplay,
  RequestPermissionIcon,
  TODAY_LOG_ACCENTS,
  TODAY_LOG_PROGRESS,
  TODAY_LOG_SURFACES,
  TodayLogActionButtonContent,
  WorkHoursStatIcon,
} from "./TodayLogUi";

function CircularProgress({
  minutes,
  hoursShort,
  subtitle,
  progress,
  isRtl,
}: {
  minutes: number;
  hoursShort: string;
  subtitle: string;
  progress: number;
  isRtl: boolean;
}) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const offset = circumference * (1 - clampedProgress);

  return (
    <div className="relative mx-auto h-44 w-44">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
        <defs>
          <linearGradient id="todayProgress" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="#F5A623" />
          </linearGradient>
        </defs>
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          className={TODAY_LOG_PROGRESS.track}
          stroke="currentColor"
          strokeWidth="9"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="url(#todayProgress)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.7s ease",
            filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.6))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
        <ElapsedTimeDisplay
          minutes={minutes}
          hoursShort={hoursShort}
          isRtl={isRtl}
        />
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.05] bg-white/[0.02] py-3 text-center transition-colors hover:bg-white/[0.05]">
      {icon}
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground" dir="ltr">
        {value}
      </span>
    </div>
  );
}

export default function TodayLogPanel() {
  const t = useTranslations("AttendancePresence");
  const locale = useLocale();
  const { dir, isRtl } = useAttendanceDirection();
  const { activePeriod, setActivePeriod } = useAttendancePresence();
  const now = useCurrentDateTime();
  const { data: constraintData, isLoading } = useUserConstraintToday();

  const workRules = constraintData?.work_rules;
  const isHoliday = Boolean(workRules?.is_holiday);
  const apiPeriods = workRules?.all_work_periods ?? [];
  const activeApiPeriod = getActiveWorkPeriod(apiPeriods);

  const periods = useMemo(
    () =>
      buildWorkPeriodTabs(apiPeriods, (key, values) =>
        t(key as "period1", values),
      ),
    [apiPeriods, t],
  );

  useEffect(() => {
    if (isHoliday || apiPeriods.length === 0) return;

    const activeIndex = apiPeriods.findIndex((period) => period.is_active);
    if (activeIndex >= 0) {
      setActivePeriod(`period-${activeIndex + 1}`);
      return;
    }

    const currentIndex =
      Number.parseInt(activePeriod.replace("period-", ""), 10) - 1;
    if (currentIndex < 0 || currentIndex >= apiPeriods.length) {
      setActivePeriod("period-1");
    }
  }, [activePeriod, apiPeriods, isHoliday, setActivePeriod]);

  const selectedApiPeriod =
    getWorkPeriodByTabId(apiPeriods, activePeriod) ?? activeApiPeriod;

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
  const elapsedMinutes = shiftProgress?.elapsedMinutes ?? 0;
  const progress = shiftProgress?.progress ?? 0;
  const workedHoursLabel = formatDurationHoursMinutes(workedMinutes);
  const scheduledHoursLabel = formatDurationHoursMinutes(
    Math.round(goalHours * 60),
  );

  const clockInDisplay = activeAttendance?.clock_in_time
    ? formatApiTime(activeAttendance.clock_in_time, locale).display
    : latestAttendance?.clock_in_time
      ? formatApiTime(latestAttendance.clock_in_time, locale).display
      : "--:--";

  const clockOutDisplay = activeAttendance?.clock_out_time
    ? formatApiTime(activeAttendance.clock_out_time, locale).display
    : latestAttendance?.clock_out_time
      ? formatApiTime(latestAttendance.clock_out_time, locale).display
      : "--:--";

  const startTimeDisplay = selectedApiPeriod
    ? formatApiTime(selectedApiPeriod.start_time, locale).display
    : "--:--";

  const endTimeDisplay = selectedApiPeriod
    ? formatApiTime(selectedApiPeriod.end_time, locale).display
    : "--:--";

  const hasActiveSession = Boolean(activeAttendance?.clock_in_time);
  const highlightTableValues = hasActiveSession || workedMinutes > 0;

  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const handleRequestPermission = async () => {
    setIsRequestingPermission(true);
    try {
      toast.info(t("underDevelopment"));
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const statItems = [
    {
      key: "check-in",
      icon: <CheckInStatIcon />,
      label: t("checkIn"),
      value: startTimeDisplay,
    },
    {
      key: "check-out",
      icon: <CheckOutStatIcon />,
      label: t("checkOut"),
      value: endTimeDisplay,
    },
    {
      key: "work-hours",
      icon: <WorkHoursStatIcon />,
      label: t("workHours"),
      value: scheduledHoursLabel,
    },
  ];

  const tableColumns = [
    { key: "date", label: t("date") },
    { key: "check-in", label: t("checkIn") },
    { key: "departure", label: t("departure") },
    { key: "hours", label: t("hours") },
  ];

  return (
    <div
      className="relative h-auto w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-sidebar p-4"
      style={{
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 18px 40px -24px rgba(0,0,0,0.7)",
      }}
      dir={dir}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-20 end-[-20%] h-48 w-48 rounded-full bg-primary/25 opacity-40 blur-3xl"
      />

      <h3 className="relative z-10 mb-4 flex items-center gap-2.5 text-start text-base font-semibold text-foreground">
        <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-primary to-primary/40" />
        {t("todayLog")}
      </h3>

      {isLoading ? (
        <div className="flex min-h-[320px] items-center justify-center text-sm text-muted-foreground">
          {t("loading")}
        </div>
      ) : isHoliday ? (
        <HappyHolidayScreen
          title={t("happyHoliday")}
          message={t("happyHolidayMessage")}
          // reason={workRules?.reason}
        />
      ) : (
        <>
          {periods.length > 0 ? (
            <div className="relative z-10 mb-5 flex border-b border-white/10">
              {periods.map((period) => {
                const isActive = activePeriod === period.id;

                return (
                  <button
                    key={period.id}
                    type="button"
                    onClick={() => setActivePeriod(period.id)}
                    className={cn(
                      "relative flex-1 px-1 py-2.5 text-xs transition-colors sm:text-sm",
                      isActive
                        ? "font-medium text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {period.label}
                    {isActive ? (
                      <span className="absolute inset-x-2 bottom-0 h-1 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div
            className="relative z-10 mb-4 rounded-2xl border border-white/[0.06] px-4 py-6"
            style={{
              background:
                "radial-gradient(120% 120% at 50% 0%, hsl(var(--primary) / 0.10), hsl(var(--popover)) 60%)",
            }}
          >
            <CircularProgress
              minutes={elapsedMinutes}
              hoursShort={t("hoursShort")}
              subtitle={t("timeElapsed")}
              progress={progress}
              isRtl={isRtl}
            />
          </div>

          <p className="relative z-10 mb-5 text-center text-sm text-muted-foreground">
            {t("todayGoalLabel", { hours: goalHours.toFixed(1) })}
          </p>

          <div className="relative z-10 mb-5 grid grid-cols-3 gap-2">
            {statItems.map((item) => (
              <StatItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>

          <div
            className={cn(
              "relative z-10 mb-4 overflow-hidden rounded-xl border border-white/[0.06] text-sm",
              TODAY_LOG_SURFACES.cardMuted,
            )}
          >
            <div
              className={cn(
                "grid grid-cols-4 text-xs text-muted-foreground",
                TODAY_LOG_SURFACES.card,
              )}
            >
              {tableColumns.map((column) => (
                <div key={column.key} className="p-2.5 text-center">
                  {column.label}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 text-xs text-foreground">
              <div className="p-2.5 text-center">{t("today")}</div>
              <div
                className={cn(
                  "p-2.5 text-center",
                  highlightTableValues &&
                    cn("font-medium", TODAY_LOG_ACCENTS.highlight),
                )}
                dir="ltr"
              >
                {clockInDisplay}
              </div>
              <div
                className="p-2.5 text-center text-muted-foreground"
                dir="ltr"
              >
                {clockOutDisplay}
              </div>
              <div
                className={cn(
                  "p-2.5 text-center",
                  highlightTableValues &&
                    cn("font-medium", TODAY_LOG_ACCENTS.highlight),
                )}
                dir="ltr"
              >
                {workedMinutes > 0 ? workedHoursLabel : "--:--"}
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-2.5">
            {showButton && actionPeriod && workRules?.location_work ? (
              <AttendanceActionDialogs
                workPeriod={actionPeriod}
                locationWork={workRules.location_work}
                disabled={!canPerform}
              />
            ) : showButton ? (
              <Button
                className="h-12 w-full rounded-xl border-0 bg-primary text-base font-medium text-primary-foreground shadow-[0_8px_24px_-8px_hsl(var(--primary))] transition-all hover:bg-primary/90"
                disabled
              >
                <TodayLogActionButtonContent
                  label={
                    isClockOut
                      ? t("registerDeparture")
                      : t("registerAttendance")
                  }
                  icon={
                    isClockOut ? <CheckOutActionIcon /> : <CheckInActionIcon />
                  }
                />
              </Button>
            ) : null}
            {!isLoading && !showButton ? (
              <p className="text-center text-xs text-muted-foreground">
                {workRules?.reason ?? t("cannotRegisterNow")}
              </p>
            ) : null}
            <Button
              variant="outline"
              className="h-11 w-full rounded-xl border-border/60 bg-popover text-foreground hover:bg-popover/90"
              loading={isRequestingPermission}
              onClick={handleRequestPermission}
            >
              <TodayLogActionButtonContent
                label={t("requestPermission")}
                icon={<RequestPermissionIcon />}
              />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
