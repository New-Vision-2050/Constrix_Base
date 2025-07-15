"use client";
import { TableBuilder } from "@/modules/table";
import ExportButton from "@/modules/table/components/ExportButton";
import { LoginIdentifierTableConfig } from "./components/table/LoginIdentifierTableConfig";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import { CalendarSearch } from "lucide-react";
import CanSeeContent from "@/components/shared/CanSeeContent";

export default function LoginIdentifierTab() {
  const canList = can(PERMISSION_ACTIONS.LIST , PERMISSION_SUBJECTS.IDENTIFIER) as boolean
  const config = LoginIdentifierTableConfig();

  return (
    <CanSeeContent canSee={canList}>
      <div className="space-y-7">
        <TableBuilder
          config={config}
          searchBarActions={
            <div className="flex items-center gap-3">
              {/* <DialogFormBuilder
              config={loginWayFormConfig}
              trigger={<button>Open Form</button>}
              onSuccess={(values) => console.log("Form submitted:", values)}
            />{" "} */}
            </div>
          }
        />
      </div>
    </CanSeeContent>
  );
}
