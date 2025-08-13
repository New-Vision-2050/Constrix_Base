"use client";
import { Button } from "@/components/ui/button";
import { SheetFormBuilder } from "@/modules/form-builder";
import { TableBuilder } from "@/modules/table";
import { OrgStructureSettingsJobTypesTableConfig } from "./table-config";
import { GetOrgStructureSettingsJobTypesFormConfig } from "./form-config";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { ArrowDownNarrowWide } from "lucide-react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

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
            <Can check={[PERMISSIONS.organization.jobType.create]}>
              <SheetFormBuilder
                config={GetOrgStructureSettingsJobTypesFormConfig()}
                trigger={<Button>اضافة نوع الوظيفة</Button>}
                onSuccess={handleFormSuccess}
                />
              <Button variant="outline" size="sm" disabled>
                <ArrowDownNarrowWide className="mr-2 h-4 w-4" />
                ترتيب
              </Button>
            </Can>
          </div>
        }
      />
    </div>
  );
}
