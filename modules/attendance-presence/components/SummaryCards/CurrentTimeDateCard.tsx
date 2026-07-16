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
      icon={<CalendarDays size={18} />}
      title={t("currentTimeDate")}
      accent="#F5A623"
      footer={
        <div className="flex justify-center">
          <span className="inline-block rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-foreground">
            {formatFullDate(now, locale)}
          </span>
        </div>
      }
    >
      <div className="flex items-baseline justify-center gap-1.5" dir="ltr">
        <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
          {time}
        </span>
        {period ? (
          <span className="text-xl font-bold" style={{ color: "#F5A623" }}>
            {period}
          </span>
        ) : null}
      </div>
    </SummaryCardShell>
  );
}
