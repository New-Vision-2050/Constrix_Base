"use client";
import { TableBuilder } from "@/modules/table";
import ExportButton from "@/modules/table/components/ExportButton";
import { LoginIdentifierTableConfig } from "./components/table/LoginIdentifierTableConfig";

export default function LoginIdentifierTab() {
  const config = LoginIdentifierTableConfig();

  return (
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
            <ExportButton data={[]} />
          </div>
        }
      />
    </div>
  );
}
