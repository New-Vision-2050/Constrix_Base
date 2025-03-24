"use client";
import { TableBuilder } from "@/modules/table";
import { LoginWaysConfig } from "./components/table/config";
import ExportButton from "@/modules/table/components/ExportButton";
import { loginWayFormConfig } from "./components/form/config";
import DialogFormBuilder from "@/modules/form-builder/components/DialogFormBuilder";
import { Button } from "@/components/ui/button";
import { useTableStore } from "@/modules/table/store/useTableStore";

export default function LoginWaysTab() {
  const config = LoginWaysConfig();
  const tableStore = useTableStore.getState();

  return (
    <div className="space-y-7">
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <DialogFormBuilder
              config={loginWayFormConfig}
              trigger={<Button>أضافة طريقة دخول جديدة</Button>}
              onSuccess={(values) => {
                tableStore.reloadTable(config.tableId);
              }}
            />{" "}
            <ExportButton data={[]} />
          </div>
        }
      />
    </div>
  );
}
