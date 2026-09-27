"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { BranchYearCard } from "@/modules/hr-settings-vacations/hooks/usePublicHolidayBranchCards";

type Props = {
  cards: BranchYearCard[];
  onSelectYear: (branchId: string, year: number) => void;
  onSelectBranch: (branchId: string) => void;
  isLoading?: boolean;
};

export default function BranchYearCards({
  cards,
  onSelectYear,
  onSelectBranch,
  isLoading,
}: Props) {
  const t = useTranslations("HRSettingsVacations.publicLeaves.table");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
    );
  }

  if (cards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const hasYears = card.years.length > 0;

        return (
          <article
            key={card.id}
            className="overflow-hidden rounded-xl border bg-background shadow-sm"
          >
            {hasYears ? (
              <div className="relative flex min-h-24 w-full items-center justify-center px-4 py-6">
                <span className="absolute end-3 top-3 text-muted-foreground">
                  <Info className="h-4 w-4" />
                </span>
                <h3 className="text-center text-lg font-semibold">{card.name}</h3>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onSelectBranch(card.id)}
                className="relative flex min-h-24 w-full items-center justify-center px-4 py-6 transition-colors hover:bg-muted/40"
              >
                <span className="absolute end-3 top-3 text-muted-foreground">
                  <Info className="h-4 w-4" />
                </span>
                <h3 className="text-center text-lg font-semibold">{card.name}</h3>
              </button>
            )}
            <div className="flex min-h-12 flex-wrap items-center justify-center gap-2 bg-[#1d4f91] px-3 py-3">
              {hasYears ? (
                card.years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => onSelectYear(card.id, year)}
                    className="min-w-16 rounded-full bg-white px-4 py-1 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    {year}
                  </button>
                ))
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectBranch(card.id)}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {t("noHolidays")}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
