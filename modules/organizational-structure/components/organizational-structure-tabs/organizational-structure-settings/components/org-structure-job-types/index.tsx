"use client";
import { Button } from "@/components/ui/button";
import { SheetFormBuilder } from "@/modules/form-builder";
import { TableBuilder } from "@/modules/table";
import { OrgStructureSettingsJobTypesTableConfig } from "./table-config";
import { GetOrgStructureSettingsJobTypesFormConfig } from "./form-config";
import { useTableStore } from "@/modules/table/store/useTableStore";


export default function OrgStructureJobTypesSetting() {
  // ** declare nad define component state and state
  const config = OrgStructureSettingsJobTypesTableConfig();

  const handleFormSuccess = () => {
    const tableStore = useTableStore.getState();

    tableStore.reloadTable(config.tableId);

    setTimeout(() => {
      tableStore.setLoading(config.tableId, false);
    }, 100);
  };

  // ** return component ui.
  return (
    <div className="px-8 space-y-7">
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={GetOrgStructureSettingsJobTypesFormConfig()}
              trigger={<Button>اضافة نوع الوظيفة</Button>}
              onSuccess={handleFormSuccess}
            />
          </div>
        }
      />
    </div>
  );
}
