"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddBrandDialog from "@/modules/stores/components/dialogs/add-brand";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useBrandsListTableConfig } from "./_config/list-table-config";
import { statisticsConfig } from "./component/statistics-config";
import StatisticsStoreRow from "@/components/shared/layout/statistics-store";

function BrandsView() {
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const tableConfig = useBrandsListTableConfig({
    onEdit: (id: string) => setEditingBrandId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();
  return (
    <>
      <StatisticsStoreRow config={statisticsConfig} />

      <AddBrandDialog
        open={Boolean(editingBrandId)}
        onClose={() => setEditingBrandId(null)}
        brandId={editingBrandId || undefined}
      />
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <>
            <DialogTrigger
              component={AddBrandDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>
                  {t("labels.add")} {t("brand.singular")}
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

export default BrandsView;
