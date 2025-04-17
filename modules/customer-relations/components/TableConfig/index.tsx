"use client";
import { Button } from "@/components/ui/button";
import { SheetFormBuilder } from "@/modules/form-builder";
import { customerRelationFormConfig } from "@/modules/form-builder/configs/customerRelationFormConfig";
import { TableBuilder } from "@/modules/table";
import ExportButton from "@/modules/table/components/ExportButton";
import { CustomerRelationConfig } from "@/modules/table/utils/configs/customerRelationsConfig";
import React from "react";

function TableConfig() {
  const config = CustomerRelationConfig();

  return (
    <div>
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={customerRelationFormConfig}
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
