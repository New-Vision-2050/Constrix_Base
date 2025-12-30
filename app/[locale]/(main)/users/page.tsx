"use client";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import { Button } from "@/components/ui/button";
import { SheetFormBuilder } from "@/modules/form-builder";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { UsersConfig } from "@/modules/table/utils/configs/usersTableConfig";
import { statisticsConfig } from "@/modules/users/components/statistics-config";
import React, { useState } from "react";
import { GetCompanyUserFormConfig } from "@/modules/form-builder/configs/companyUserFormConfig";
import { useTranslations } from "next-intl";
import { withPermissionsPage } from "@/lib/permissions/client/withPermissionsPage";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";
import { useTableStore } from "@/modules/table/store/useTableStore";

const UsersPage = () => {
  const config = UsersConfig();
  const t = useTranslations("Companies");
  const [refreshWidget, setRefreshWidget] = useState(0);
  // handle reload table

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow toggleRefetch={refreshWidget} config={statisticsConfig} />{" "}
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <Can check={[PERMISSIONS.user.create]}>
              <SheetFormBuilder
                config={GetCompanyUserFormConfig(t)}
                trigger={<Button>إنشاء مستخدم</Button>}
                onSuccess={(values) => {
                  setRefreshWidget(prev => ++prev)
                  const tableStore = useTableStore.getState();
                  tableStore.reloadTable(config.tableId);
                }}
              />
            </Can>
          </div>
        }
      />
    </div>
  );
};

export default withPermissionsPage(UsersPage, [
  Object.values(PERMISSIONS.user),
]);
