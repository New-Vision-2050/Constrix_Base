"use client";

import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { LeaveBalanceTotals } from "../types";

const TRANSLATION_NAMESPACE =
  "UserProfile.tabs.contractTabs.contractSettings";

type Props = {
  totals: LeaveBalanceTotals;
  loading?: boolean;
};

/**
 * Summary stat widgets for the selected year: available / used / pending /
 * total entitlement — one tinted card each, like the reference design.
 */
export default function LeaveStatsCards({ totals, loading = false }: Props) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const locale = useLocale();

  const cards = [
    {
      key: "available",
      label: t("availableBalance"),
      value: totals.available,
      classes: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    },
    {
      key: "used",
      label: t("usedBalance"),
      value: totals.used,
      classes: "border-red-500/20 bg-red-500/10 text-red-400",
    },
    {
      key: "pending",
      label: t("pendingBalance"),
      value: totals.pending,
      classes: "border-orange-500/20 bg-orange-500/10 text-orange-400",
    },
    {
      key: "entitled",
      label: t("totalEntitled"),
      value: totals.entitled,
      classes: "border-purple-500/20 bg-purple-500/10 text-purple-400",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-24 animate-pulse rounded-xl bg-white/5"
          />
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
          <span className="text-2xl font-bold">
            {Number(card.value).toLocaleString(locale)}{" "}
            <span className="text-base font-medium">{t("dayUnit")}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
