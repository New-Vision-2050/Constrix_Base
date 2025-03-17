"use client";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import { Button } from "@/components/ui/button";
import { SheetFormBuilder } from "@/modules/form-builder";
import ExportButton from "@/modules/table/components/ExportButton";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { UsersConfig } from "@/modules/table/utils/configs/usersTableConfig";
import { statisticsConfig } from "@/modules/users/components/statistics-config";
import React from "react";
import { companyUserFormConfig } from "@/modules/form-builder/configs/companyUserFormConfig";

const UsersPage = () => {
  const config = UsersConfig();
  
  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />{" "}
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={companyUserFormConfig}
              trigger={<Button>إنشاء مستخدم</Button>}
              onSuccess={(values) => {
                console.log("Form submitted successfully:", values);
              }}
            />{" "}
            <ExportButton data={["omar"]} />
          </div>
        }
      />
    </div>
  );
};

export default UsersPage;
