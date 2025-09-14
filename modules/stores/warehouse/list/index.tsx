"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddWarehouse2Dialog from "@/modules/stores/components/dialogs/add-warehouse-2";
import { useTranslations } from "next-intl";
import { useWarehousesListTablConfig } from "./_config/list-table-config";
import { useState } from "react";

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
      <AddWarehouse2Dialog
        open={Boolean(editingWarehouseId)}
        onClose={() => setEditingWarehouseId(null)}
        warehouseId={editingWarehouseId || undefined}
        onSuccess={() => reloadTable()}
      />
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <>
            <DialogTrigger
              component={AddWarehouse2Dialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>
                  {t("labels.add")} {t("warehouse.singular")}
                </Button>
              )}
            />
          </>
        }
        tableId={tableConfig.tableId}
      />
    </>
  );
}

export default ListWarehousesView;
