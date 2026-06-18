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
      icon={<Target size={18} className="text-primary" />}
      title={t("todayGoal")}
      footer={
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{t("hoursCompleted")}</span>
          <span dir="ltr">
            {completedLabel} / {goalHours.toFixed(1)}
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
