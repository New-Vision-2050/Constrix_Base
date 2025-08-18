import { TableBuilder } from "@/modules/table";
import { getPublicVacationTableConfig } from "./PublicVacationsTableConfig";
import { SheetFormBuilder } from "@/modules/form-builder";
import { getSetPublicVacationFormConfig } from "./SetPublicVacationFormConfig";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function PublicVacations() {
  const config = getPublicVacationTableConfig();
  const t = useTranslations("HRSettingsVacations.publicLeaves.table");

  return (
    <div>
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={getSetPublicVacationFormConfig(t)}
              trigger={<Button>{t("addPublicVacation")}</Button>}
            />
          </div>
        }
      />
    </div>
  );
}
