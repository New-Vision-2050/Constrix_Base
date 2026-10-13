"use client";

import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { AdvanceTotals } from "../types";

const TRANSLATION_NAMESPACE =
  "UserProfile.tabs.contractTabs.contractSettings";

type Props = {
  totals: AdvanceTotals;
  loading?: boolean;
};

/** Live availability summary across all assigned advance policies. */
export default function AdvanceStatsCards({ totals, loading = false }: Props) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const locale = useLocale();
  const format = (value: number) => Number(value).toLocaleString(locale);

  const cards = [
    {
      key: "remainingSlots",
      label: t("advanceRemainingSlots"),
      value: format(totals.remainingSlots),
      classes: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    },
    {
      key: "activeCount",
      label: t("advanceActiveCount"),
      value: format(totals.activeCount),
      classes: "border-purple-500/20 bg-purple-500/10 text-purple-400",
    },
    {
      key: "pendingAmount",
      label: t("advancePendingAmount"),
      value: format(totals.pendingAmount),
      classes: "border-orange-500/20 bg-orange-500/10 text-orange-400",
    },
    {
      key: "activeAmount",
      label: t("advanceApprovedAmount"),
      value: format(totals.activeAmount),
      classes: "border-red-500/20 bg-red-500/10 text-red-400",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-24 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border p-4",
            card.classes,
          )}
        >
          <span className="text-sm font-medium">{card.label}</span>
          <span className="text-2xl font-bold">{card.value}</span>
        </div>
      ))}
    </div>
  );
}
