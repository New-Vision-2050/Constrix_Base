"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { useWarehousesListTablConfig } from "./_config/list-table-config";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddWarehouse2Dialog from "@/modules/stores/components/dialogs/add-warehouse-2";

function ListWarehousesPage() {
  const tableConfig = useWarehousesListTablConfig();
  const { reloadTable } = useTableReload(tableConfig.tableId);
  return (
    <TableBuilder
      config={tableConfig}
      searchBarActions={
        <>
          <DialogTrigger
            component={AddWarehouse2Dialog}
            dialogProps={{ onSuccess: () => reloadTable() }}
            render={({ onOpen }) => <Button onClick={onOpen}>open</Button>}
          />
        </>
      }
      tableId={tableConfig.tableId}
    />
  );
}

export default ListWarehousesPage;
