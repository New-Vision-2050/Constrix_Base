"use client";
import { TableBuilder } from "@/modules/table";
import React from "react";
import { SubTableConfig } from "../../config/SubTableConfig";
import { SheetFormBuilder } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";
import { CreateUserFormConfig } from "../../config/CreateUserFormConfig";

const SubTables = () => {
  return (
    <TableBuilder
      config={SubTableConfig()}
      searchBarActions={
        <div className="flex items-center gap-3">
          <SheetFormBuilder
            config={CreateUserFormConfig()}
            trigger={<Button>إنشاء مستخدم</Button>}
          />{" "}
        </div>
      }
    />
  );
};

export default SubTables;
