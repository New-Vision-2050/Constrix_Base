"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { ContractSummaryCardData } from "../../types/reports";
import { useAttendanceDirection } from "../../utils/direction";
import { formatLocalizedValue } from "../../utils/i18n";
import { ContractSummaryCard } from "./ContractSummaryCard";

interface ContractSummaryCardsProps {
  cards: ContractSummaryCardData[];
}

export default function ContractSummaryCards({ cards }: ContractSummaryCardsProps) {
  const t = useTranslations("AttendancePresence.reports");
  const locale = useLocale();
  const { dir } = useAttendanceDirection();

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-3" dir={dir}>
      {cards.map((card) => (
        <ContractSummaryCard
          key={card.key}
          title={t(card.titleKey)}
          icon={card.icon}
          metrics={card.metrics.map((metric) => ({
            key: metric.key,
            icon: metric.icon,
            label: t(metric.labelKey),
            value: formatLocalizedValue(metric.value, locale),
            unit: t(metric.unitKey),
          }))}
        />
      ))}
    </div>
  );
}
