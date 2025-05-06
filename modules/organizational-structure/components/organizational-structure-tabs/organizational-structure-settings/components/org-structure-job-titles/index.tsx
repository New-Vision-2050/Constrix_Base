"use client";
import { Button } from "@/components/ui/button";
import { SheetFormBuilder } from "@/modules/form-builder";
import { TableBuilder } from "@/modules/table";
import { OrgStructureSettingsTableConfig } from "./table-config";
import { GetOrgStructureSettingsFormConfig } from "./form-config";

export default function OrgStructureJobTitlesSetting() {
  // ** declare nad define component state and state
  const config = OrgStructureSettingsTableConfig();

  // ** return component ui.
  return (
    <div className="px-8 space-y-7">
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={GetOrgStructureSettingsFormConfig()}
              trigger={<Button>اضافة المسمى الوظيفي</Button>}
            />
          </div>
        }
      />
    </div>
  );
}
