"use client";
import { TableBuilder } from "@/modules/table";
import ExportButton from "@/modules/table/components/ExportButton";
import { LoginIdentifierTableConfig } from "./components/table/LoginIdentifierTableConfig";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function LoginIdentifierTab() {
  const config = LoginIdentifierTableConfig();

  return (
    <div className="space-y-7">
      <Can check={[PERMISSIONS.identifier.list]}>
        <TableBuilder
          config={config}
          searchBarActions={
            <div className="flex items-center gap-3">
              {/* <DialogFormBuilder
              config={loginWayFormConfig}
              trigger={<button>Open Form</button>}
              onSuccess={(values) => console.log("Form submitted:", values)}
            />{" "} */}
              <ExportButton data={[]} />
            </div>
          }
        />
      </Can>
    </div>
  );
}
