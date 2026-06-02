"use client";
import { TableBuilder } from "@/modules/table";
import ExportButton from "@/modules/table/components/ExportButton";
import { UniversitiesTableConfig } from "./config";
import DialogFormBuilder from "@/modules/form-builder/components/DialogFormBuilder";
import { universityFormConfig } from "./components/form/config";
import { Button } from "@/components/ui/button";
import { useTableStore } from "@/modules/table/store/useTableStore";

export default function UniversitiesSettingTab() {
  const config = UniversitiesTableConfig();
  const tableStore = useTableStore.getState();

  return (
    <div className="space-y-7">
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <DialogFormBuilder
              config={universityFormConfig}
              trigger={<Button>إضافة جامعة جديدة</Button>}
              onSuccess={() => {
                tableStore.reloadTable(config.tableId);
              }}
            />
            <ExportButton data={[]} />
          </div>
        }
      />
    </div>
  );
}
