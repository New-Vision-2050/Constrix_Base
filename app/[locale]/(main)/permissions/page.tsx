"use client";

import CanSeeContent from "@/components/shared/CanSeeContent";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import { can } from "@/hooks/useCan";
import { statisticsConfig } from "@/modules/companies/components/statistics-config";
import { permissionsTableConfig } from "@/modules/roles-and-permissions/config/PermissionsTableConfig";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import { TableBuilder } from "@/modules/table";
import React from "react";

const AuthoritiesPage = () => {
  const canSee = can(PERMISSION_ACTIONS.LIST, PERMISSION_SUBJECTS.PERMISSION) as boolean;
  const config = permissionsTableConfig();
  return (
    <CanSeeContent canSee={canSee}>
      <div className="px-8 space-y-7">
        <StatisticsRow config={statisticsConfig} />
        <TableBuilder config={config} />
      </div>
    </CanSeeContent>
  );
};

export default AuthoritiesPage;
