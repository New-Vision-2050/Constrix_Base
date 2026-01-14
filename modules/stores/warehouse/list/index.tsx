"use client";

import StatisticsStoreRow from "@/components/shared/layout/statistics-store";
import { statisticsConfig } from "../component/statistics-config";
import { WarehousesTableV2 } from "../table-v2/WarehousesTableV2";

function ListWarehousesView() {
  return (
    <>
      <StatisticsStoreRow config={statisticsConfig} />
      <WarehousesTableV2 />
    </>
  );
}

export default ListWarehousesView;
