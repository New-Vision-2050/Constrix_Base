"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { CouponDialog } from "@/modules/stores/components/dialogs/add-coupons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useCouponTableConfig } from "../../../_config/couponTableConfig";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

function CouponView() {
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const tableConfig = useCouponTableConfig({
    onEdit: (id: string) => setEditingCouponId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();

  return (
    <>
      <Can check={[PERMISSIONS.ecommerce.coupon.update]}>
        <CouponDialog
          open={Boolean(editingCouponId)}
          onClose={() => setEditingCouponId(null)}
          couponId={editingCouponId || undefined}
          onSuccess={() => reloadTable()}
        />
      </Can>
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <Can check={[PERMISSIONS.ecommerce.coupon.create]}>
            <DialogTrigger
              component={CouponDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>اضافة قسيمة</Button>
              )}
            />
          </Can>
        }
        tableId={tableConfig.tableId}
      />
    </>
  );
}

export default CouponView;
