"use client";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import { Button } from "@/components/ui/button";
import { SheetFormBuilder } from "@/modules/form-builder";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { UsersConfig } from "@/modules/table/utils/configs/usersTableConfig";
import { statisticsConfig } from "@/modules/users/components/statistics-config";
import React from "react";
import { GetCompanyUserFormConfig } from "@/modules/form-builder/configs/companyUserFormConfig";
import {useTranslations} from "next-intl";
import { useTableStore } from "@/modules/table/store/useTableStore";

const UsersPage = () => {
  const config = UsersConfig();
    const t = useTranslations('Companies');

    const [isOpen, setIsOpen] = React.useState(false);

    const onConfirmUserDataEmailValidation = ()=>{
      setIsOpen(false);
      const tableStore = useTableStore.getState();
      tableStore.reloadTable(config.tableId);
      setTimeout(() => {
        tableStore.setLoading(config.tableId, false);
      }, 100);
    }

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />{" "}
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={GetCompanyUserFormConfig(t , onConfirmUserDataEmailValidation)}
              trigger={<Button>إنشاء مستخدم</Button>}
              onSuccess={(values) => {
                console.log("Form submitted successfully:", values);
              }}
              isOpen={isOpen}
              onOpenChange={(s)=> setIsOpen(s)}
            />{" "}
          </div>
        }
      />
    </div>
  );
};

export default UsersPage;
