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
      icon={<TrendingUp size={18} />}
      title={t("monthSummary", { month: monthLabel })}
      accent="#9C6BFF"
    >
      <div className="flex items-stretch justify-between gap-1">
        {MONTH_SUMMARY_ITEMS.map((item) => {
          const count = data?.summary?.[item.key] ?? 0;
          const { color, backgroundColor } = getDotColorStyles(item.dotColor);

          return (
            <div
              key={item.key}
              className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl border border-white/[0.04] bg-white/[0.02] py-2 text-center transition-colors hover:bg-white/[0.05]"
            >
              <span
                className="mb-0.5 flex h-6 w-6 items-center justify-center rounded-full"
                style={{ backgroundColor }}
              >
                <StatusDot dotColor={item.dotColor} className="h-1.5 w-1.5" />
              </span>
              <span
                className="w-full truncate text-[10px] leading-tight"
                style={{ color }}
              >
                {statusT(item.labelKey)}
              </span>
              <span className="text-sm font-bold text-foreground">
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
