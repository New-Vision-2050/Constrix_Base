"use client";
import ExportButton from "@/modules/table/components/ExportButton";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { companiesConfig } from "@/modules/table/utils/configs/companiesConfig";

import React from "react";

const page = () => {
  return (
    <div className="px-8">
      <TableBuilder
        config={companiesConfig}
        searchBarActions={
          <div>
            <ExportButton data={["omar"]} />
          </div>
        }
      />
    </div>
  );
};

export default page;
