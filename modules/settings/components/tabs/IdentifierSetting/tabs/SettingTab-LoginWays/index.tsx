"use client";
import { TableBuilder } from "@/modules/table";
import { LoginWaysConfig } from "./components/table/config";
import { SheetFormBuilder } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";
import ExportButton from "@/modules/table/components/ExportButton";
import { loginWayFormConfig } from "./components/form/config";

export default function LoginWaysTab() {
  const config = LoginWaysConfig();

  return (
    <div className="space-y-7">
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={loginWayFormConfig}
              trigger={<Button>اضافة اعداد</Button>}
            />{" "}
            <ExportButton data={[]} />
          </div>
        }
      />
    </div>
  );
}
