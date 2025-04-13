"use client";
import { TableBuilder } from "@/modules/table";
import ExportButton from "@/modules/table/components/ExportButton";
import { UniversitiesTableConfig } from "./config";

export default function UniversitiesSettingTab() {
  const config = UniversitiesTableConfig();
  return (
    <div className="space-y-7">
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <ExportButton data={[]} />
          </div>
        }
      />
    </div>
  );
}
