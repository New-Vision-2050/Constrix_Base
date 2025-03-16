"use client";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import ExportButton from "@/modules/table/components/ExportButton";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { CompaniesConfig } from "@/modules/table/utils/configs/companiesConfig";

import React from "react";
import { SheetFormBuilder, sheetFormConfig } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";
import { statisticsConfig } from "@/modules/companies/components/statistics-config";
import {companiesFormConfig} from "@/modules/form-builder/configs/companiesFormConfig";
import { useTableStore } from "@/modules/table/store/useTableStore";

const CompaniesPage = () => {
  // Get the translated config using the component
  const config = CompaniesConfig();

  // Create a function that will get the reloadTable function when needed
  // This avoids the infinite update loop
  const handleFormSuccess = (values: any) => {
    // Import the store directly to avoid hooks in callbacks
    const tableStore = useTableStore.getState();
    
    // Manually trigger the reload logic
    tableStore.setLoading(true);
    setTimeout(() => {
      tableStore.setLoading(false);
    }, 100);
    
    console.log("Form submitted successfully:", values);
  };

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />

      <TableBuilder
        config={config}
        searchBarActions={
          <div>
            <ExportButton data={["omar"]} />
            <SheetFormBuilder
              config={companiesFormConfig}
              trigger={<Button>انشاء شركة</Button>}
              onSuccess={handleFormSuccess}
            />
          </div>
        }
      />
    </div>
  );
};

export default CompaniesPage;
