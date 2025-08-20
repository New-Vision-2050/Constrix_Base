import { TableBuilder } from "@/modules/table";
import { getVacationTypeTableConfig } from "./VacationTypeTableConfig";
import { SheetFormBuilder } from "@/modules/form-builder";
import { getSetVacationTypeFormConfig } from "./SetVacationTypeForm";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useTableStore } from "@/modules/table/store/useTableStore";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function VacationTypes() {
  const config = getVacationTypeTableConfig();
  const t = useTranslations("HRSettingsVacations.leavesTypes.table");

  const handleOnSuccessFn = () => {
    const tableStore = useTableStore.getState();
    // Use the centralized reloadTable method from the TableStore
    tableStore.reloadTable(config.tableId);
  };

  return (
    <Can check={[PERMISSIONS.vacations.settings.leaveType.view]}>
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <Can check={[PERMISSIONS.vacations.settings.leaveType.create]}>
              <SheetFormBuilder
                config={getSetVacationTypeFormConfig(t, handleOnSuccessFn)}
                trigger={<Button>{t("addVacationType")}</Button>}
              />
            </Can>
          </div>
        }
      />
    </Can>
  );
}
