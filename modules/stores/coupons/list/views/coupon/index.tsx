"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { CouponDialog } from "@/modules/stores/components/dialogs/add-coupons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useCouponTableConfig } from "../../../_config/couponTableConfig";

function CouponView() {
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const tableConfig = useCouponTableConfig({
    onEdit: (id: string) => setEditingCouponId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();
  
  return (
    <>
      <CouponDialog
        open={Boolean(editingCouponId)}
        onClose={() => setEditingCouponId(null)}
        couponId={editingCouponId || undefined}
        onSuccess={() => reloadTable()}
      />
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <>
            <DialogTrigger
              component={CouponDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>اضافة قسيمة</Button>
              )}
            />
          </>
        }
        tableId={tableConfig.tableId}
      />
    </>
  );
}

export default CouponView;
