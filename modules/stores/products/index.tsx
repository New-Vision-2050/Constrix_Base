"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { useTranslations } from "next-intl";
import { useProductsListTableConfig } from "./_config/list-table-config";
import AddProductDialog from "../components/dialogs/add-product";

function ListProductsView() {
  const tableConfig = useProductsListTableConfig({
    onEdit: () => null,
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();
  return (
    <>
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <>
            <DialogTrigger
              component={AddProductDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>
                  {t("labels.add")} {t("product.singular")}
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

export default ListProductsView;
