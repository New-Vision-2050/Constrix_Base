"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { FeaturedDealDialog } from "@/modules/stores/components/dialogs/add-coupons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFeaturedDealTableConfig } from "../../../_config/featuredDealTableConfig";

function FeaturedDealView() {
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const tableConfig = useFeaturedDealTableConfig({
    onEdit: (id: string) => setEditingDealId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();
  
  return (
    <>
      <FeaturedDealDialog
        open={Boolean(editingDealId)}
        onClose={() => setEditingDealId(null)}
        dealId={editingDealId || undefined}
        onSuccess={() => reloadTable()}
      />
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <>
            <DialogTrigger
              component={FeaturedDealDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>اضافة صفقة مميزة</Button>
              )}
            />
          </>
        }
        tableId={tableConfig.tableId}
      />
    </>
  );
}

export default FeaturedDealView;
