"use client";

import { useMemo } from "react";
import { Target } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useUserConstraintToday } from "../../hooks/useAttendanceActions";
import { getActiveWorkPeriod } from "../../utils/attendance";
import SummaryCardShell from "./SummaryCardShell";

export default function TodayGoalCard() {
  const t = useTranslations("AttendancePresence");
  const locale = useLocale();
  const { data } = useUserConstraintToday();

  const activePeriod = getActiveWorkPeriod(data?.work_rules.all_work_periods);
  const goalHours = activePeriod?.total_work_hours ?? 9;
  const completedHours = activePeriod?.total_hours_present ?? 0;
  const progress = goalHours > 0 ? Math.min(1, completedHours / goalHours) : 0;

  const completedLabel = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(completedHours),
    [completedHours, locale],
  );

  return (
    <SummaryCardShell
      icon={<Target size={18} />}
      title={t("todayGoal")}
      accent="#2EB88A"
      footer={
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{t("hoursCompleted")}</span>
          <span dir="ltr" className="font-medium text-foreground/90">
            {completedLabel} / {goalHours.toFixed(1)}
          </span>
        </div>
      }
    >
      <p className="mb-3 text-2xl font-bold text-foreground">
        {goalHours.toFixed(1)}{" "}
        <span className="text-sm font-medium text-muted-foreground">
          {t("hours")}
        </span>
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, #2EB88A, #4ADE80)",
            boxShadow: "0 0 12px rgba(46,184,138,0.6)",
          }}
        />
      </div>
    </SummaryCardShell>
  );
}
