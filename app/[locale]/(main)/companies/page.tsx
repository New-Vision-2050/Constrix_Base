"use client";
import ExportButton from "@/modules/table/components/ExportButton";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { CompaniesConfig } from "@/modules/table/utils/configs/companiesConfig";

import React from "react";

const CompaniesPage = () => {
  // Get the translated config using the component
  const config = CompaniesConfig();
  
  return (
    <div className="px-8">
      <TableBuilder
        config={config}
        searchBarActions={
          <div>
            <ExportButton data={["omar"]} />
          </div>
        }
      />
    </div>
  );
};

export default CompaniesPage;
