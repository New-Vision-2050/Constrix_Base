"use client";

import StatisticsRow from "@/components/shared/layout/statistics-row";
import { baseURL } from "@/config/axios-config";
import { permissionsTableConfig } from "@/modules/permissions/config/PermissionsTableConfig";
import { TableBuilder } from "@/modules/table";
import ArrowStaticIcon from "@/public/icons/arrow-static";
import ChartStaticIcon from "@/public/icons/chart-static";
import CheckStatic from "@/public/icons/check-static";
import PersonStaticIcon from "@/public/icons/person-static";
import React from "react";

export const statisticsConfig = {
  url: `${baseURL}/role_and_permissions/permissions/widgets`,
  icons: [
    <PersonStaticIcon key={1} />,
    <CheckStatic key={2} />,
    <ChartStaticIcon key={3} />,
    <ArrowStaticIcon key={4} />,
  ],
};

const AuthoritiesPage = () => {
  const config = permissionsTableConfig();
  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />
      <TableBuilder config={config} />
    </div>
  );
};

export default AuthoritiesPage;
