"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { DealOfDayDialog } from "@/modules/stores/components/dialogs/add-coupons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDealOfDayTableConfig } from "../../../_config/dealOfDayTableConfig";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

function DealOfDayView() {
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const tableConfig = useDealOfDayTableConfig({
    onEdit: (id: string) => setEditingDealId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();

  return (
    <>
      <Can check={[PERMISSIONS.ecommerce.dealDay.update]}>
        <DealOfDayDialog
          open={Boolean(editingDealId)}
          onClose={() => setEditingDealId(null)}
          dealId={editingDealId || undefined}
          onSuccess={() => reloadTable()}
        />
      </Can>
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <Can check={[PERMISSIONS.ecommerce.dealDay.create]}>
            <DialogTrigger
              component={DealOfDayDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>اضافة صفقة اليوم</Button>
              )}
            />
          </Can>
        }
        tableId={tableConfig.tableId}
      />
    </>
  );
}

export default DealOfDayView;
