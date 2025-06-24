
import StatisticsRow from "@/components/shared/layout/statistics-row";
import React from "react";
import { statisticsConfig } from "./statistics-config";
import { TableBuilder } from "@/modules/table";
import {
  GetCompanyUserFormConfig,
  SheetFormBuilder,
} from "@/modules/form-builder";
import { useTranslations } from "next-intl";
import { bouquetsConfig } from "@/modules/table/utils/configs/bouquetsTableConfig";
import { Button } from "@/components/ui/button";

function EntryPointBouquets() {
  const t = useTranslations("Companies");
  const config = bouquetsConfig();

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />

      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={GetCompanyUserFormConfig(t)}
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
