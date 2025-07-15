"use client";
import { Button } from "@/components/ui/button";
import { SheetFormBuilder } from "@/modules/form-builder";
import { TableBuilder } from "@/modules/table";
import { OrgStructureSettingsJobTypesTableConfig } from "./table-config";
import { GetOrgStructureSettingsJobTypesFormConfig } from "./form-config";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { ArrowDownNarrowWide } from "lucide-react";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

export default function OrgStructureJobTypesSetting() {
      const permissions = can(
        [PERMISSION_ACTIONS.LIST, PERMISSION_ACTIONS.CREATE],
        PERMISSION_SUBJECTS.ORGANIZATION_JOB_TITLE
      ) as {
        LIST: boolean;
        CREATE: boolean;
      };
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
    <CanSeeContent canSee={permissions.LIST}>
      <div className="px-8 space-y-7">
        <TableBuilder
          config={config}
          searchBarActions={
            <>
              {permissions.CREATE && (
                <div className="flex items-center gap-3">
                  <SheetFormBuilder
                    config={GetOrgStructureSettingsJobTypesFormConfig()}
                    trigger={<Button>اضافة نوع الوظيفة</Button>}
                    onSuccess={handleFormSuccess}
                  />
                  <Button variant="outline" size="sm" disabled>
                    <ArrowDownNarrowWide className="mr-2 h-4 w-4" />
                    ترتيب
                  </Button>
                </div>
              )}
            </>
          }
        />
      </div>
    </CanSeeContent>
  );
}
