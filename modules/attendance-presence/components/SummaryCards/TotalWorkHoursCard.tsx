"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import SummaryCardShell from "./SummaryCardShell";

export default function TotalWorkHoursCard() {
  const t = useTranslations("AttendancePresence");

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
        {t("hoursAndMinutes", { hours: 9, minutes: 36 })}
      </p>
    </SummaryCardShell>
  );
}
