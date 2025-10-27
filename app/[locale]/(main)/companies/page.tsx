"use client";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { CompaniesConfig } from "@/modules/table/utils/configs/companiesConfig";

import React, { useState } from "react";
import { SheetFormBuilder } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";
import { statisticsConfig } from "@/modules/companies/components/statistics-config";
import { GetCompaniesFormConfig } from "@/modules/form-builder/configs/companiesFormConfig";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { useResetTableOnRouteChange } from "@/modules/table";
import { useModal } from "@/hooks/use-modal";
import CompanySaveDialog from "@/modules/companies/components/CompanySaveDialog";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";
import { withPermissionsPage } from "@/lib/permissions/client/withPermissionsPage";

const CompaniesPage = () => {
  // Get the translated config using the component
  const t = useTranslations("Companies");
  const config = CompaniesConfig();
  const [isOpen, handleOpen, handleClose] = useModal();
  const [companyNumber, setCompanyNumber] = useState<string>("");

  // Use the reset hook to clear table state on route changes
  // The tableId is now defined in the config
  useResetTableOnRouteChange(config.tableId);
  const permissions = usePermissions();
  console.log("permissions", permissions);
  // Create a function that will get the reloadTable function when needed
  // This avoids the infinite update loop
  const handleFormSuccess = (values: Record<string, unknown>) => {
    // Import the store directly to avoid hooks in callbacks
    const tableStore = useTableStore.getState();

    // Use the centralized reloadTable method from the TableStore
    tableStore.reloadTable(config.tableId);

    // After a short delay, set loading back to false
    setTimeout(() => {
      tableStore.setLoading(config.tableId, false);
    }, 100);

    // Add type safety for the result structure
    const result = values.result as
      | {
          data?: {
            payload?: { id?: string; company?: { serial_no?: string } };
          };
        }
      | undefined;
    const companyId =
      result?.data?.payload?.company?.serial_no ||
      result?.data?.payload?.id ||
      "";

    console.log(
      "handleFormSuccess_values",
      result?.data?.payload?.company?.serial_no
    );
    setCompanyNumber(companyId);
    handleOpen();

    console.log("Form submitted successfully:", values);
  };

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />

      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <Can check={[PERMISSIONS.company.create]}>
              <SheetFormBuilder
                config={GetCompaniesFormConfig(t)}
                trigger={<Button>{t("createCompany")}</Button>}
                onSuccess={handleFormSuccess}
              />
            </Can>
            <CompanySaveDialog
              open={isOpen}
              handleOpen={handleOpen}
              handleClose={handleClose}
              number={companyNumber}
            />
          </div>
        }
      />
    </div>
  );
};

export default withPermissionsPage(CompaniesPage, [
  Object.values(PERMISSIONS.company),
]);
