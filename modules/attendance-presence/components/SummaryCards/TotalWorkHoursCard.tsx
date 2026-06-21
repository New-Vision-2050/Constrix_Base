"use client";

import { Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { useUserAttendanceCalendar } from "../../hooks/useUserAttendanceCalendar";
import { formatLocalizedNumber } from "../../utils/i18n";
import { splitDecimalHours } from "../../utils/time";
import SummaryCardShell from "./SummaryCardShell";

export default function TotalWorkHoursCard() {
  const t = useTranslations("AttendancePresence");
  const locale = useLocale();
  const { selectedMonth } = useAttendancePresence();

  const month = selectedMonth.getMonth() + 1;
  const year = selectedMonth.getFullYear();
  const { data, isLoading } = useUserAttendanceCalendar(month, year);

  const { hours, minutes } = splitDecimalHours(data?.summary?.total_work_hours ?? 0);

  return (
    <SummaryCardShell
      icon={<Clock size={18} className="text-primary" />}
      title={t("totalWorkHours")}
      footer={
        <div className="border-t border-border pt-3">
          <p className="text-xs text-muted-foreground text-start">{t("thisMonth")}</p>
        </div>
      }
    >
      <p className="text-xl font-semibold text-foreground leading-tight">
        {isLoading && !data
          ? "—"
          : t("hoursAndMinutes", {
              hours: formatLocalizedNumber(hours, locale),
              minutes: formatLocalizedNumber(minutes, locale),
            })}
      </p>
    </SummaryCardShell>
  );
}
