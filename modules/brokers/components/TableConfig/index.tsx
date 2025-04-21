"use client";
import { Button } from "@/components/ui/button";
import { SheetFormBuilder } from "@/modules/form-builder";
import { BrokersFormConfig } from "@/modules/form-builder/configs/brokersFormConfig";
import { customerRelationFormConfig } from "@/modules/form-builder/configs/customerRelationFormConfig";
import { TableBuilder } from "@/modules/table";
import ExportButton from "@/modules/table/components/ExportButton";
import { BrokersConfig } from "@/modules/table/utils/configs/brokersConfig";
import React from "react";

function TableConfig() {
  const config = BrokersConfig();

  return (
    <div>
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={BrokersFormConfig}
              trigger={<Button>اضافة</Button>}

              // onSuccess={handleFormSuccess}
            />
            <Button variant="destructive">طلبات العملاء</Button>
            <ExportButton data={[]} />
            {/* <CompanySaveDialog
              open={isOpen}
              handleOpen={handleOpen}
              handleClose={handleClose}
              number={companyNumber}
            /> */}
          </div>
        }
      />
    </div>
  );
}

export default TableConfig;
