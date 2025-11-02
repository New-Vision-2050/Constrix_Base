"use client";

import { Card } from "@/components/ui/card";
import { TableBuilder } from "@/modules/table";
import { useHomeStoreTableConfig } from "../_config/homeStoreTableConfig";

export default function RequestsTable() {
  const tableConfig = useHomeStoreTableConfig();

  return (
    <Card className="bg-sidebar/50  p-6">
      <h2 className="text-white text-2xl mb-6">الطلبات</h2>
      <TableBuilder config={tableConfig} tableId={tableConfig.tableId} />
    </Card>
  );
}
