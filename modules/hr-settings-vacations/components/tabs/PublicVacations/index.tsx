import { TableBuilder } from "@/modules/table";
import { getPublicVacationTableConfig } from "./PublicVacationsTableConfig";
import { SheetFormBuilder } from "@/modules/form-builder";
import { getSetPublicVacationFormConfig } from "./SetPublicVacationFormConfig";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useTableStore } from "@/modules/table/store/useTableStore";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function PublicVacations() {
  const config = getPublicVacationTableConfig();
  const t = useTranslations("HRSettingsVacations.publicLeaves.table");

  const handleOnSuccessFn = () => {
    const tableStore = useTableStore.getState();
    // Use the centralized reloadTable method from the TableStore
    tableStore.reloadTable(config.tableId);
  };

  return (
    <Can check={[PERMISSIONS.vacations.settings.publicHoliday.view]}>
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <Can check={[PERMISSIONS.vacations.settings.publicHoliday.create]}>
              <SheetFormBuilder
                config={getSetPublicVacationFormConfig(t, handleOnSuccessFn)}
                trigger={<Button>{t("addPublicVacation")}</Button>}
              />
            </Can>
          </div>
        }
      />
    </Can>
  );
}
