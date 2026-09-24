"use client";

import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { TableBuilder } from "@/modules/table";
import { getPublicVacationTableConfig } from "./PublicVacationsTableConfig";
import PublicVacationsAddSheet from "./PublicVacationsAddSheet";
import { Button } from "@/components/ui/button";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { BranchYearCard } from "@/modules/hr-settings-vacations/hooks/usePublicHolidayBranchCards";

type Props = {
  branchId: string;
  year: number;
  branchName: string;
  currentYear: number;
  cards: BranchYearCard[];
  onBack: () => void;
  onMutateSuccess: () => void;
};

export default function PublicVacationsTableView({
  branchId,
  year,
  branchName,
  currentYear,
  cards,
  onBack,
  onMutateSuccess,
}: Props) {
  const t = useTranslations("HRSettingsVacations.publicLeaves.table");

  const selectedCard = cards.find((card) => card.id === branchId);
  const canAdd =
    year === currentYear ||
    (selectedCard != null && selectedCard.years.length === 0);

  const config = getPublicVacationTableConfig({
    year,
    branchId,
    onMutateSuccess,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1 px-2"
          onClick={onBack}
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          {t("backToBranches")}
        </Button>
        <div className="flex flex-wrap items-baseline gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{branchName}</span>
          <span aria-hidden>·</span>
          <span>{year}</span>
        </div>
      </div>

      <TableBuilder
        key={`${branchId}-${year}`}
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <Can check={[PERMISSIONS.vacations.settings.publicHoliday.create]}>
              {canAdd ? (
                <PublicVacationsAddSheet
                  year={year}
                  branchId={branchId}
                  onSuccess={onMutateSuccess}
                />
              ) : (
                <Button disabled>{t("addPublicVacation")}</Button>
              )}
            </Can>
          </div>
        }
      />
    </div>
  );
}
