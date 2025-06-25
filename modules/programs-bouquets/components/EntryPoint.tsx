
import StatisticsRow from "@/components/shared/layout/statistics-row";
import React from "react";
import { statisticsConfig } from "./statistics-config";
import { TableBuilder } from "@/modules/table";
import {
  SheetFormBuilder,
} from "@/modules/form-builder";
import { useTranslations } from "next-intl";
import { programsConfig } from "@/modules/table/utils/configs/bouquetsTableConfig";
import { Button } from "@/components/ui/button";
import { ProgramFormConfig } from "@/modules/form-builder/configs/programFormConfig";

function EntryPointPrograms() {
  const t = useTranslations("Companies");
  const config = programsConfig();

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />

      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={ProgramFormConfig(t)}
              trigger={<Button>اضافة برنامج</Button>}
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

export default EntryPointPrograms;
