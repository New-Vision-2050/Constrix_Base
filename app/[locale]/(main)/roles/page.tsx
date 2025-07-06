"use client"
import StatisticsRow from '@/components/shared/layout/statistics-row'
import { statisticsConfig } from '@/modules/companies/components/statistics-config'
import { rolesTableConfig } from '@/modules/roles/config/RolesTableConfig';
import { TableBuilder } from '@/modules/table';
import React from 'react'

const RolesPages = () => {
  const config = rolesTableConfig();
  return (
    <div className="px-8 space-y-7">
      <StatisticsRow config={statisticsConfig} />
      <TableBuilder config={config} />
    </div>
  );
}

export default RolesPages
