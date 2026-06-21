"use client";

import { TrendingUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { useUserAttendanceCalendar } from "../../hooks/useUserAttendanceCalendar";
import { formatMonthYear, MONTH_SUMMARY_ITEMS } from "../../utils/calendar";
import { formatLocalizedNumber } from "../../utils/i18n";
import { getDotColorStyles } from "../../utils/status-colors";
import { StatusDot } from "../shared/StatusDot";
import SummaryCardShell from "./SummaryCardShell";

export default function MonthSummaryCard() {
  const t = useTranslations("AttendancePresence");
  const statusT = useTranslations("AttendancePresence.status");
  const locale = useLocale();
  const { selectedMonth } = useAttendancePresence();

  const month = selectedMonth.getMonth() + 1;
  const year = selectedMonth.getFullYear();
  const { data, isLoading } = useUserAttendanceCalendar(month, year);
  const monthLabel = formatMonthYear(selectedMonth, locale);

  return (
    <SummaryCardShell
      icon={<TrendingUp size={18} className="text-chart-2" />}
      title={t("monthSummary", { month: monthLabel })}
    >
      <div className="flex items-start justify-between gap-1">
        {MONTH_SUMMARY_ITEMS.map((item) => {
          const count = data?.summary?.[item.key] ?? 0;
          const { color } = getDotColorStyles(item.dotColor);

          return (
            <div
              key={item.key}
              className="flex flex-1 min-w-0 flex-col items-center gap-1 text-center"
            >
              <StatusDot dotColor={item.dotColor} />
              <span
                className="text-[10px] leading-tight truncate w-full"
                style={{ color }}
              >
                {statusT(item.labelKey)}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {isLoading && !data
                  ? "—"
                  : formatLocalizedNumber(count, locale)}
              </span>
            </div>
          );
        })}
      </div>
    </SummaryCardShell>
  );
}
