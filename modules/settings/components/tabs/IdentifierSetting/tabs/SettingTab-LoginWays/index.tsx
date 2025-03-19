"use client";
import { TableBuilder } from "@/modules/table";
import { LoginWaysConfig } from "./components/table/config";
import ExportButton from "@/modules/table/components/ExportButton";
import { loginWayFormConfig } from "./components/form/config";
import DialogFormBuilder from "@/modules/form-builder/components/DialogFormBuilder";

export default function LoginWaysTab() {
  const config = LoginWaysConfig();

  return (
    <div className="space-y-7">
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <DialogFormBuilder
              config={loginWayFormConfig}
              trigger={<button>Open Form</button>}
              onSuccess={(values) => console.log("Form submitted:", values)}
            />{" "}
            <ExportButton data={[]} />
          </div>
        }
      />
    </div>
  );
}
