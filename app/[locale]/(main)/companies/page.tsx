"use client";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import ExportButton from "@/modules/table/components/ExportButton";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { CompaniesConfig } from "@/modules/table/utils/configs/companiesConfig";

import React, {useRef} from "react";
import {SheetFormBuilder, sheetFormConfig} from "@/modules/form-builder";
import {Button} from "@/components/ui/button";
import CreateBuilderModule, {CreateBuilderModuleRef} from "@/features/create-builder";

const CompaniesPage = () => {
    const companyUserModuleRef = useRef<CreateBuilderModuleRef>(null);

    // Get the translated config using the component
  const config = CompaniesConfig();

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow />

      <CreateBuilderModule
        btnLabel="أنشاء شركة"
        moduleId={"create-company-user"}
      />

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
              <CreateBuilderModule
                  btnLabel="أنشاء شركة"
                  moduleId={"create-company-user"}
                  ref={companyUserModuleRef}
              />
          </div>
        }
      />
    </div>
  );
};

export default CompaniesPage;
