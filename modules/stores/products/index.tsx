"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useProductsListTableConfig } from "./_config/list-table-config";
import AddProductDialog from "../components/dialogs/add-product";
import { useState } from "react";
import { useRouter } from "next/navigation";

function ListProductsView() {
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const router = useRouter();

  const tableConfig = useProductsListTableConfig({
    onEdit: (id: string) => setEditingProductId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();
  
  const handleAddProduct = () => {
    router.push("/stores/products/add");
  };

  return (
    <>
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <>
            <Button onClick={handleAddProduct}>
              {t("labels.add")} {t("product.singular")}
            </Button>
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
