"use client";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import ExportButton from "@/modules/table/components/ExportButton";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { CompaniesConfig } from "@/modules/table/utils/configs/companiesConfig";

import React, { useState } from "react";
import { SheetFormBuilder } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";
import { statisticsConfig } from "@/modules/companies/components/statistics-config";
import { companiesFormConfig } from "@/modules/form-builder/configs/companiesFormConfig";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { useModal } from "@/hooks/use-modal";
import CompanySaveDialog from "@/modules/companies/components/CompanySaveDialog";

const CompaniesPage = () => {
  // Get the translated config using the component
  const config = CompaniesConfig();
  const [isOpen, handleOpen, handleClose] = useModal();
  const [companyNumber, setCompanyNumber] = useState<string>("");

  // Create a function that will get the reloadTable function when needed
  // This avoids the infinite update loop
  const handleFormSuccess = (values: Record<string, unknown>) => {
    // Import the store directly to avoid hooks in callbacks
    const tableStore = useTableStore.getState();

    // Manually trigger the reload logic
    tableStore.setLoading(true);
    setTimeout(() => {
      tableStore.setLoading(false);
    }, 100);

    // Add type safety for the result structure
    const result = values.result as
      | { data?: { payload?: { id?: string } } }
      | undefined;
    const companyId = result?.data?.payload?.id || "";
    setCompanyNumber(companyId);
    handleOpen();

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
            />{" "}
            <CompanySaveDialog
              open={isOpen}
              handleOpen={handleOpen}
              handleClose={handleClose}
              number={companyNumber}
            />
          </div>
        }
      />
    </div>
  );
};

export default CompaniesPage;
