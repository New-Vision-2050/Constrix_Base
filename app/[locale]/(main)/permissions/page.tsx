"use client";

import StatisticsRow from "@/components/shared/layout/statistics-row";
import withPermissions from "@/lib/permissions/client/withPermissions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { statisticsConfig } from "@/modules/companies/components/statistics-config";
import { permissionsTableConfig } from "@/modules/permissions/config/PermissionsTableConfig";
import { TableBuilder } from "@/modules/table";
import React from "react";

const AuthoritiesPage = () => {
  const config = permissionsTableConfig();
  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />
      <TableBuilder config={config} />
    </div>
  );
};

export default withPermissions(AuthoritiesPage, [PERMISSIONS.permission.list]);
