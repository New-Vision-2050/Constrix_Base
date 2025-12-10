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
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

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
      <Can check={[PERMISSIONS.ecommerce.brand.update]}>
        <AddBrandDialog
          open={Boolean(editingBrandId)}
          onClose={() => setEditingBrandId(null)}
          brandId={editingBrandId || undefined}
        />
      </Can>

      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <Can check={[PERMISSIONS.ecommerce.brand.create]}>
            <DialogTrigger
              component={AddBrandDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>
                  {t("labels.add")} {t("brand.singular")}
                </Button>
              )}
            />
          </Can>
        }
        tableId={tableConfig.tableId}
      />
    </>
  );
}

export default BrandsView;
