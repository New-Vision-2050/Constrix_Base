"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { useTranslations } from "next-intl";
import { useProductsListTableConfig } from "./_config/list-table-config";
import AddProductDialog from "../components/dialogs/add-product";
import { useState } from "react";

function ListProductsView() {
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const tableConfig = useProductsListTableConfig({
    onEdit: (id: string) => setEditingProductId(id),
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

      {/* Edit Product Dialog */}
      {editingProductId && (
        <AddProductDialog
          open={!!editingProductId}
          onClose={() => setEditingProductId(null)}
          onSuccess={() => {
            setEditingProductId(null);
            reloadTable();
          }}
          editingProductId={editingProductId}
        />
      )}
    </>
  );
}

export default ListProductsView;
