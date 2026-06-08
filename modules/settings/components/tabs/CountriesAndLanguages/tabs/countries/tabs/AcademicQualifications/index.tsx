"use client";
import { TableBuilder } from "@/modules/table";
import ExportButton from "@/modules/table/components/ExportButton";
import { AcademicQualificationsTableConfig } from "./config";
import DialogFormBuilder from "@/modules/form-builder/components/DialogFormBuilder";
import { academicQualificationFormConfig } from "./components/form/config";
import { Button } from "@/components/ui/button";
import { useTableStore } from "@/modules/table/store/useTableStore";

export default function AcademicQualificationsSettingTab() {
  const config = AcademicQualificationsTableConfig();
  const tableStore = useTableStore.getState();

  return (
    <div className="space-y-7">
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <DialogFormBuilder
              config={academicQualificationFormConfig}
              trigger={<Button>إضافة مؤهل أكاديمي جديد</Button>}
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
