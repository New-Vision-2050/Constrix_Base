import { TableBuilder } from "@/modules/table";
import { getPublicVacationTableConfig } from "./PublicVacationsTableConfig";
import { SheetFormBuilder } from "@/modules/form-builder";
import { getSetPublicVacationFormConfig } from "./SetPublicVacationFormConfig";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useTableStore } from "@/modules/table/store/useTableStore";

export default function PublicVacations() {
  const config = getPublicVacationTableConfig();
  const t = useTranslations("HRSettingsVacations.publicLeaves.table");

  const handleOnSuccessFn = () => {
    const tableStore = useTableStore.getState();
    // Use the centralized reloadTable method from the TableStore
    tableStore.reloadTable(config.tableId);
  };

  return (
    <div>
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={getSetPublicVacationFormConfig(t, handleOnSuccessFn)}
              trigger={<Button>{t("addPublicVacation")}</Button>}
            />
          </div>
        }
      />
    </div>
  );
}
