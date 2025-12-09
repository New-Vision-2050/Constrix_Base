"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { useState, useEffect } from "react";
import { useRequestsTableConfig } from "../../_config/requestsTableConfig";
import { useTranslations } from "next-intl";
import { RequestStatusDialog } from "@/modules/stores/components/dialogs/add-requests/RequestStatusDialog";
import AddRequestDialog from "@/modules/stores/components/dialogs/add-requests/AddRequestDialog";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

function RequestsView() {
  const { can } = usePermissions();
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const t = useTranslations("requests");

  const tableConfig = useRequestsTableConfig({
    onEdit: (id: string) => {
      setEditingRequestId(id);
    },
    onAddRequest: () => {
      setAddDialogOpen(true);
    },
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);

  return (
    <div className="w-full" dir="rtl">
      <Can check={[PERMISSIONS.ecommerce.order.update]}>
        <RequestStatusDialog
          open={Boolean(editingRequestId)}
          onClose={() => setEditingRequestId(null)}
          requestId={editingRequestId || undefined}
          onSuccess={() => reloadTable()}
        />
      </Can>

      <Can check={[PERMISSIONS.ecommerce.order.create]}>
        <AddRequestDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSuccess={() => reloadTable()}
        />
      </Can>

      <div className="max-w-8xl mx-auto">
        {/* Table Section */}
        <TableBuilder
          config={tableConfig}
          tableId={tableConfig.tableId}
          searchBarActions={
            <Can check={[PERMISSIONS.ecommerce.order.create]}>
              <Button onClick={() => setAddDialogOpen(true)}>
                {t("addNewRequest")}
              </Button>
            </Can>
          }
        />
      </div>
    </div>
  );
}

export default RequestsView;
