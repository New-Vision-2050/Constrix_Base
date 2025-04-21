import StatisticsRow from "@/components/shared/layout/statistics-row";
import React from "react";
import { statisticsConfig } from "../components/statistics-config";
import TableConfig from "../components/TableConfig";

function BrokersModel() {
  return (
    <div>
      <StatisticsRow config={statisticsConfig} />
      <TableConfig />
    </div>
  );
}

export default BrokersModel;
