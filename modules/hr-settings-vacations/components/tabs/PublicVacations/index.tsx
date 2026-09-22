"use client";

import { useEffect, useState } from "react";
import { TableBuilder } from "@/modules/table";
import { getPublicVacationTableConfig } from "./PublicVacationsTableConfig";
import { SheetFormBuilder } from "@/modules/form-builder";
import { getSetPublicVacationFormConfig } from "./SetPublicVacationFormConfig";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useTableStore } from "@/modules/table/store/useTableStore";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePublicHolidayBranchCards } from "@/modules/hr-settings-vacations/hooks/usePublicHolidayBranchCards";
import BranchYearCards from "./BranchYearCards";

export default function PublicVacations() {
  const t = useTranslations("HRSettingsVacations.publicLeaves.table");
  const { cards, currentYear, isLoading, invalidate } =
    usePublicHolidayBranchCards();
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    if (!selectedBranchId && cards.length > 0) {
      setSelectedBranchId(cards[0].id);
      setSelectedYear(currentYear);
    }
  }, [cards, currentYear, selectedBranchId]);

  const selectedCard = cards.find((card) => card.id === selectedBranchId);
  const canAdd =
    selectedYear === currentYear ||
    (selectedCard != null && selectedCard.years.length === 0);

  const handleOnSuccessFn = () => {
    useTableStore.getState().reloadTable("public-vacations-table");
    invalidate();
  };

  const config = getPublicVacationTableConfig({
    year: selectedYear,
    branchId: selectedBranchId,
    onMutateSuccess: handleOnSuccessFn,
  });

  const handleYearSelect = (branchId: string, year: number) => {
    setSelectedBranchId(branchId);
    setSelectedYear(year);
  };

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranchId(branchId);
    setSelectedYear(currentYear);
  };

  return (
    <Can check={[PERMISSIONS.vacations.settings.publicHoliday.view]}>
      <div className="flex flex-col gap-6">
        <BranchYearCards
          cards={cards}
          selectedBranchId={selectedBranchId}
          selectedYear={selectedYear}
          onSelectYear={handleYearSelect}
          onSelectBranch={handleBranchSelect}
          isLoading={isLoading}
        />
        <TableBuilder
          key={`${selectedBranchId ?? "all"}-${selectedYear}`}
          config={config}
          searchBarActions={
            <div className="flex items-center gap-3">
              <Can
                check={[PERMISSIONS.vacations.settings.publicHoliday.create]}
              >
                {canAdd ? (
                  <SheetFormBuilder
                    config={getSetPublicVacationFormConfig(
                      t,
                      handleOnSuccessFn,
                      {
                        year: currentYear,
                        branchId: selectedBranchId,
                      }
                    )}
                    trigger={<Button>{t("addPublicVacation")}</Button>}
                  />
                ) : (
                  <Button disabled>{t("addPublicVacation")}</Button>
                )}
              </Can>
            </div>
          }
        />
      </div>
    </Can>
  );
}
