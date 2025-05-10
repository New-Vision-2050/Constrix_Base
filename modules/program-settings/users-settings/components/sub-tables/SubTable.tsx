"use client";
import { TableBuilder } from "@/modules/table";
import React from "react";
import { SubTableConfig } from "../../config/SubTableConfig";
import { SheetFormBuilder } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";
import { CreateUserFormConfig } from "../../config/CreateUserFormConfig";

const SubTables = () => {
  const programSlug = "users";
  return (
    <TableBuilder
      config={SubTableConfig(programSlug)}
      searchBarActions={
        <div className="flex items-center gap-3">
          <SheetFormBuilder
            config={CreateUserFormConfig(programSlug)}
            trigger={<Button>إنشاء جدول</Button>}
          />{" "}
        </div>
      }
    />
  );
};

export default SubTables;
