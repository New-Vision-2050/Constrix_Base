"use client";

import StatisticsRow from "@/components/shared/layout/statistics-row";
import { Button } from "@/components/ui/button";
import { SheetFormBuilder } from "@/modules/form-builder";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { UsersConfig } from "@/modules/table/utils/configs/usersTableConfig";
import { statisticsConfig } from "./statistics-config";
import { GetCompanyUserFormConfig } from "@/modules/form-builder/configs/companyUserFormConfig";
import { useTranslations } from "next-intl";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

const UsersContent = () => {
  const canCreate = can(PERMISSION_ACTIONS.CREATE, PERMISSION_SUBJECTS.USER) as boolean;

  const config = UsersConfig();
  const t = useTranslations("Companies");

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />
      <TableBuilder
        config={config}
        searchBarActions={
          canCreate ? (
            <div className="flex items-center gap-3">
              <SheetFormBuilder
                config={GetCompanyUserFormConfig(t)}
                trigger={<Button>إنشاء مستخدم</Button>}
                onSuccess={(values) => {
                  console.log("Form submitted successfully:", values);
                }}
              />
            </div>
          ) : null
        }
      />
    </div>
  );
};

export default UsersContent;
