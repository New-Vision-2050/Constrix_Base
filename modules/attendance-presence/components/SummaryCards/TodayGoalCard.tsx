"use client";

import { useMemo } from "react";
import { Target } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { MOCK_WORK_PERIODS } from "../../constants/mock-data";
import { useCurrentDateTime } from "../../hooks/useCurrentDateTime";
import { useUserAttendanceCalendar } from "../../hooks/useUserAttendanceCalendar";
import { parseDurationFormatted } from "../../utils/time";
import SummaryCardShell from "./SummaryCardShell";

function getTodayDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function TodayGoalCard() {
  const t = useTranslations("AttendancePresence");
  const now = useCurrentDateTime();
  const { activePeriod } = useAttendancePresence();

  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const { data } = useUserAttendanceCalendar(month, year);

  const currentPeriod = MOCK_WORK_PERIODS.find((period) => period.id === activePeriod);
  const goalHours = currentPeriod?.goalHours ?? 9;

  const completedHours = useMemo(() => {
    const todayKey = getTodayDateKey(now);
    const todayDay = data?.days.find((day) => day.date === todayKey);
    const workedMinutes = parseDurationFormatted(todayDay?.duration_formatted);

    return Math.round((workedMinutes / 60) * 10) / 10;
  }, [data?.days, now]);

  const progress = goalHours > 0 ? Math.min(1, completedHours / goalHours) : 0;

  return (
    <SummaryCardShell
      icon={<Target size={18} className="text-primary" />}
      title={t("todayGoal")}
      footer={
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{t("hoursCompleted")}</span>
          <span dir="ltr">
            {completedHours.toFixed(1)} / {goalHours.toFixed(1)}
          </span>
        </div>
      }
    >
      <p className="text-xl font-semibold text-foreground mb-3">
        {goalHours.toFixed(1)} {t("hours")}
      </p>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </SummaryCardShell>
  );
}
