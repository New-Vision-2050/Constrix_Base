"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { OfferDialog } from "@/modules/stores/components/dialogs/add-coupons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useOfferTableConfig } from "../../../_config/offerTableConfig";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";

function OfferView() {
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const tableConfig = useOfferTableConfig({
    onEdit: (id: string) => setEditingOfferId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();

  return (
    <>
      <Can check={[PERMISSIONS.ecommerce.flashDeal.update]}>
        <OfferDialog
          open={Boolean(editingOfferId)}
          onClose={() => setEditingOfferId(null)}
          offerId={editingOfferId || undefined}
          onSuccess={() => reloadTable()}
        />
      </Can>
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <Can check={[PERMISSIONS.ecommerce.flashDeal.create]}>
            <DialogTrigger
              component={OfferDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>اضافة عرض</Button>
              )}
            />
          </Can>
        }
        tableId={tableConfig.tableId}
      />
    </>
  );
}

export default OfferView;
