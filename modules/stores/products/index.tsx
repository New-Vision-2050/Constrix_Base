"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useProductsListTableConfig } from "./_config/list-table-config";
import { useRouter } from "next/navigation";

function ListProductsView() {
  const router = useRouter();

  const tableConfig = useProductsListTableConfig({
    onEdit: (id: string) => router.push(`/stores/products/edit/${id}`),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();
  
  const handleAddProduct = () => {
    router.push("/stores/products/add");
  };

  return (
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
  );
}

export default ListProductsView;
