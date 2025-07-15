"use client";
import { TableBuilder } from "@/modules/table";
import { LoginWaysConfig } from "./components/table/config";
import ExportButton from "@/modules/table/components/ExportButton";
import { loginWayFormConfig } from "./components/form/config";
import DialogFormBuilder from "@/modules/form-builder/components/DialogFormBuilder";
import { Button } from "@/components/ui/button";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

export default function LoginWaysTab() {
  const permissions = can([PERMISSION_ACTIONS.LIST, PERMISSION_ACTIONS.CREATE], PERMISSION_SUBJECTS.LOGIN_WAY) as {
    LIST: boolean;
    CREATE: boolean;
  };
  const config = LoginWaysConfig();
  const tableStore = useTableStore.getState();

  return (
    <CanSeeContent canSee={true}>
      <div className="space-y-7">
        <TableBuilder
          config={config}
          searchBarActions={
            <div className="flex items-center gap-3">
              {permissions.CREATE && (
                <DialogFormBuilder
                  config={loginWayFormConfig}
                  trigger={<Button>أضافة طريقة دخول جديدة</Button>}
                  onSuccess={() => {
                    tableStore.reloadTable(config.tableId);
                  }}
                />
              )}
            </div>
          }
        />
      </div>
    </CanSeeContent>
  );
}
