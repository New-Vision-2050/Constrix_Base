"use client";

import { useTranslations } from "next-intl";
import { TableBuilder } from "@/modules/table";
import { getPublicVacationTableConfig } from "./PublicVacationsTableConfig";
import PublicVacationsAddSheet from "./PublicVacationsAddSheet";
import PublicVacationsTableHeader from "./PublicVacationsTableHeader";
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
      <PublicVacationsTableHeader
        branchName={branchName}
        year={year}
        currentYear={currentYear}
        yearsOnBranch={selectedCard?.years.length ?? 0}
        onBack={onBack}
      />

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
