"use client";

import { CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCurrentDateTime } from "../../hooks/useCurrentDateTime";
import { formatFullDate } from "../../utils/i18n";
import { formatCurrentTimeParts } from "../../utils/time";
import SummaryCardShell from "./SummaryCardShell";

export default function CurrentTimeDateCard() {
  const t = useTranslations("AttendancePresence");
  const locale = useLocale();
  const now = useCurrentDateTime();
  const { time, period } = formatCurrentTimeParts(now, locale);

  return (
    <SummaryCardShell
      icon={<CalendarDays size={18} className="text-chart-4" />}
      title={t("currentTimeDate")}
      footer={
        <div className="flex justify-center">
          <span className="inline-block rounded-lg bg-muted/80 px-3 py-1.5 text-xs text-foreground">
            {formatFullDate(now, locale)}
          </span>
        </div>
      }
    >
      <div className="flex items-baseline justify-center gap-1.5" dir="ltr">
        <span className="text-3xl font-bold text-foreground tracking-tight">
          {time}
        </span>
        {period ? (
          <span className="text-xl font-bold text-chart-4">{period}</span>
        ) : null}
      </div>
    </SummaryCardShell>
  );
}
