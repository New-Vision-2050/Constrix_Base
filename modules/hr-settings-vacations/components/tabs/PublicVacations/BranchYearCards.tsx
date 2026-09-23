"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { BranchYearCard } from "@/modules/hr-settings-vacations/hooks/usePublicHolidayBranchCards";

type Props = {
  cards: BranchYearCard[];
  selectedBranchId: string | null;
  selectedYear: number | null;
  onSelectYear: (branchId: string, year: number) => void;
  onSelectBranch: (branchId: string) => void;
  isLoading?: boolean;
};

export default function BranchYearCards({
  cards,
  selectedBranchId,
  selectedYear,
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
        const isBranchSelected = selectedBranchId === card.id;
        const hasYears = card.years.length > 0;

        return (
          <article
            key={card.id}
            className={cn(
              "overflow-hidden rounded-xl border bg-background shadow-sm",
              isBranchSelected && "ring-2 ring-primary"
            )}
          >
            <button
              type="button"
              onClick={() => onSelectBranch(card.id)}
              className="relative flex min-h-24 w-full items-center justify-center px-4 py-6"
            >
              <span className="absolute end-3 top-3 text-muted-foreground">
                <Info className="h-4 w-4" />
              </span>
              <h3 className="text-center text-lg font-semibold">{card.name}</h3>
            </button>
            <div className="flex min-h-12 flex-wrap items-center justify-center gap-2 bg-[#1d4f91] px-3 py-3">
              {hasYears ? (
                card.years.map((year) => {
                  const isSelected = isBranchSelected && selectedYear === year;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => onSelectYear(card.id, year)}
                      className={cn(
                        "min-w-16 rounded-full px-4 py-1 text-sm font-medium transition-colors",
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-white text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      {year}
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-white/80">{t("noHolidays")}</p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
