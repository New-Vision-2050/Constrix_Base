"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { useTranslations } from "next-intl";
import { useProductsListTableConfig } from "./_config/list-table-config";
import AddProductDialog from "../components/dialogs/add-product";
import { useState } from "react";
import ArrowStaticIcon from "@/public/icons/arrow-static";
import ChartStaticIcon from "@/public/icons/chart-static";
import CheckStatic from "@/public/icons/check-static";
import PersonStaticIcon from "@/public/icons/person-static";
import { baseURL } from "@/config/axios-config";
import StatisticsRow from "@/components/shared/layout/statistics-row";

const statisticsConfig = {
  url: `${baseURL}/ecommerce/products/statistics`,
  icons: [
    <PersonStaticIcon key={1} />,
    <CheckStatic key={2} />,
    <ChartStaticIcon key={3} />,
    <ArrowStaticIcon key={4} />,
  ],
};

function ListProductsView() {
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const tableConfig = useProductsListTableConfig({
    onEdit: (id: string) => setEditingProductId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();
  return (
    <div className="space-y-6">
      <StatisticsRow config={statisticsConfig} />
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
    </div>
  );
}

export default ListProductsView;
