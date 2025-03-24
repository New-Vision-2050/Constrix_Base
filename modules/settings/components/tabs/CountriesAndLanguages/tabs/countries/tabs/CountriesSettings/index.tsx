"use client";
import { TableBuilder } from "@/modules/table";
import ExportButton from "@/modules/table/components/ExportButton";
import { CountriesTableConfig } from "./config/CountriesTableConfig";

export default function CountriesTabCountriesSettingTab() {
  const config = CountriesTableConfig();
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
