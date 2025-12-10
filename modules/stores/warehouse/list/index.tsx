"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddWarehouse2Dialog from "@/modules/stores/components/dialogs/add-warehouse-2";
import { useTranslations } from "next-intl";
import { useWarehousesListTablConfig } from "../_config/list-table-config";
import { useState } from "react";
import StatisticsStoreRow from "@/components/shared/layout/statistics-store";
import { statisticsConfig } from "../component/statistics-config";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";

function ListWarehousesView() {
  const [editingWarehouseId, setEditingWarehouseId] = useState<string | null>(
    null
  );
  const tableConfig = useWarehousesListTablConfig({
    onEdit: (id: string) => setEditingWarehouseId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();
  return (
    <>
      <StatisticsStoreRow config={statisticsConfig} />
      <Can check={[PERMISSIONS.ecommerce.warehouse.update]}>
        <AddWarehouse2Dialog
          open={Boolean(editingWarehouseId)}
          onClose={() => setEditingWarehouseId(null)}
          warehouseId={editingWarehouseId || undefined}
          onSuccess={() => reloadTable()}
        />
      </Can>
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <Can check={[PERMISSIONS.ecommerce.warehouse.create]}>
            <DialogTrigger
              component={AddWarehouse2Dialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>
                  {t("labels.add")} {t("warehouse.singular")}
                </Button>
              )}
            />
          </Can>
        }
        tableId={tableConfig.tableId}
      />
    </>
  );
}

export default ListWarehousesView;
