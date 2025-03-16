"use client";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import ExportButton from "@/modules/table/components/ExportButton";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { CompaniesConfig } from "@/modules/table/utils/configs/companiesConfig";

import React from "react";
import {SheetFormBuilder, sheetFormConfig} from "@/modules/form-builder";
import {Button} from "@/components/ui/button";

const CompaniesPage = () => {
  // Get the translated config using the component
  const config = CompaniesConfig();

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow />

      <TableBuilder
        config={config}
        searchBarActions={
          <div>
            <ExportButton data={["omar"]} />
              <SheetFormBuilder
                  config={sheetFormConfig}
                  trigger={<Button>Open Form</Button>}
                  onSuccess={(values) => {
                      console.log('Form submitted successfully:', values);
                  }}
              />
          </div>
        }
      />
    </div>
  );
};

export default CompaniesPage;
