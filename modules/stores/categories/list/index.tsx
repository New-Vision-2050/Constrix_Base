"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddCategoryDialog from "@/modules/stores/components/dialogs/add-category";
import { useTranslations } from "next-intl";
import { useCategoriesListTableConfig } from "./_config/list-table-config";
import { useState } from "react";
import ArrowStaticIcon from "@/public/icons/arrow-static";
import ChartStaticIcon from "@/public/icons/chart-static";
import { baseURL } from "@/config/axios-config";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import { LayersIcon, TrashIcon } from "lucide-react";

const statisticsConfig = {
  url: `${baseURL}/ecommerce/categories/statistics`,
  icons: [
    <LayersIcon key={1} />,
    <ArrowStaticIcon key={2} />,
    <ChartStaticIcon key={3} />,
    <TrashIcon key={4} />,
  ],
};

function ListCategoriesView() {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [addingChildTo, setAddingChildTo] = useState<string | null>(null);
  const tableConfig = useCategoriesListTableConfig({
    onEdit: (id: string) => setEditingCategoryId(id),
    onAddChild: (id: string) => setAddingChildTo(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();
  return (
    <div className="space-y-6">
      {/* //>> Release when backend response success */}
      {/* <StatisticsRow config={statisticsConfig} /> */}
      <AddCategoryDialog
        open={Boolean(editingCategoryId)}
        onClose={() => setEditingCategoryId(null)}
        categoryId={editingCategoryId || undefined}
        onSuccess={() => reloadTable()}
      />
      <AddCategoryDialog
        open={Boolean(addingChildTo)}
        onClose={() => setAddingChildTo(null)}
        parentId={addingChildTo || undefined}
        onSuccess={() => reloadTable()}
      />
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <>
            <DialogTrigger
              component={AddCategoryDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>
                  {t("labels.add")} {t("category.singular")}
                </Button>
              )}
            />
          </>
        }
        tableId={tableConfig.tableId}
      />
    </div>
  );
}

export default ListCategoriesView;
