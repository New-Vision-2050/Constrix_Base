import { TableBuilder } from "@/modules/table";
import { getVacationTypeTableConfig } from "./VacationTypeTableConfig";
import { SheetFormBuilder } from "@/modules/form-builder";
import { getSetVacationTypeFormConfig } from "./SetVacationTypeForm";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function VacationTypes() {
  const config = getVacationTypeTableConfig();
  const t = useTranslations("HRSettingsVacations.leavesTypes.table");

  return (
    <div>
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={getSetVacationTypeFormConfig(t)}
              trigger={<Button>{t("addVacationType")}</Button>}
            />
          </div>
        }
      />
    </div>
  );
}
