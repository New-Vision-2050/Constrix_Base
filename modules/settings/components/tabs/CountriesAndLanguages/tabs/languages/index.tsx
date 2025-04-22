"use client";
import { TableBuilder } from "@/modules/table";
import ExportButton from "@/modules/table/components/ExportButton";
import { LanguagesSettingTableConfig } from "./config";

export default function LanguagesSettingsTab() {
  const config = LanguagesSettingTableConfig();
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
