"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddWarehouse2Dialog from "@/modules/stores/components/dialogs/add-warehouse-2";
import { useTranslations } from "next-intl";
import { useWarehousesListTablConfig } from "./_config/list-table-config";

function ListWarehousesView() {
  const tableConfig = useWarehousesListTablConfig();
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();
  return (
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
  );
}

export default ListWarehousesView;
