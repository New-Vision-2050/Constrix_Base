
import StatisticsRow from "@/components/shared/layout/statistics-row";
import React from "react";
import { statisticsConfig } from "./statistics-config";
import { TableBuilder } from "@/modules/table";
import {
  SheetFormBuilder,
} from "@/modules/form-builder";
import { useTranslations } from "next-intl";
import { bouquetConfig } from "@/modules/table/utils/configs/bouquetTableConfig";
import { Button } from "@/components/ui/button";
import { GetBouquetFormConfig } from "@/modules/form-builder/configs/bouquetFormConfig";

function EntryPointBouquets() {
  const t = useTranslations("Bouquets");
  const config = bouquetConfig();

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />

      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={GetBouquetFormConfig(t)}
              trigger={<Button>اضافة باقة</Button>}
              onSuccess={(values) => {
                console.log("Form submitted successfully:", values);
              }}
            />{" "}
          </div>
        }
      />
    </div>
  );
}

export default EntryPointBouquets;
