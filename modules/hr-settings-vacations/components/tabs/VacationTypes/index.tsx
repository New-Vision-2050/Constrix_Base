import { TableBuilder } from "@/modules/table";
import { getVacationTypeTableConfig } from "./VacationTypeTableConfig";
import { SheetFormBuilder } from "@/modules/form-builder";

export default function VacationTypes() {
  const config = getVacationTypeTableConfig();

  return (
    <div>
      <TableBuilder
        config={config}
        // searchBarActions={
        //   <div className="flex items-center gap-3">
        //     <SheetFormBuilder
        //       config={getVacationTypeFormConfig()}
        //       trigger={<Button>{t("createCompany")}</Button>}
        //       onSuccess={handleFormSuccess}
        //     />
        //   </div>
        // }
      />
    </div>
  );
}
