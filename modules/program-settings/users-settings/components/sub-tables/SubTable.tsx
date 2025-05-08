"use client";
import { TableBuilder } from "@/modules/table";
import React from "react";
import { SubTableConfig } from "../../config/SubTableConfig";
import { GetCompanyUserFormConfig, SheetFormBuilder } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";
import { LegalDataAddReqFormEditConfig } from "@/modules/company-profile/components/official-data/legal-data-section/legal-data-add-req-form-config";

const SubTables = () => {
  return (
    <TableBuilder
      config={SubTableConfig()}
      searchBarActions={
        <div className="flex items-center gap-3">
          <SheetFormBuilder
            config={LegalDataAddReqFormEditConfig()}
            trigger={<Button>إنشاء مستخدم</Button>}
          />{" "}
        </div>
      }
    />
  );
};

export default SubTables;
