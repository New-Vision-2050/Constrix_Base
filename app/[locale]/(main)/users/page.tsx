"use client";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import { Button } from "@/components/ui/button";
import { SheetFormBuilder } from "@/modules/form-builder";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { UsersConfig } from "@/modules/table/utils/configs/usersTableConfig";
import { statisticsConfig } from "@/modules/users/components/statistics-config";
import React from "react";
import { GetCompanyUserFormConfig } from "@/modules/form-builder/configs/companyUserFormConfig";
import { useTranslations } from "next-intl";
import withPermissions from "@/lib/permissions/client/withPermissions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";

const UsersPage = () => {
  const config = UsersConfig();
  const t = useTranslations("Companies");
  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />{" "}
        <TableBuilder
          config={config}
          searchBarActions={
            <div className="flex items-center gap-3">
              <Can check={[PERMISSIONS.user.create]}>
                <SheetFormBuilder
                  config={GetCompanyUserFormConfig(t)}
                  trigger={<Button>إنشاء مستخدم</Button>}
                  onSuccess={(values) => {
                    console.log("Form submitted successfully:", values);
                  }}
                />
              </Can>
            </div>
          }
        />
    </div>
  );
};

export default withPermissions(UsersPage, [PERMISSIONS.user.list]);
