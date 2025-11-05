"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { useState, useEffect } from "react";
import { useRequestsTableConfig } from "../../_config/requestsTableConfig";
import { useTranslations } from "next-intl";
import { RequestStatusDialog } from "@/modules/stores/components/dialogs/add-requests/RequestStatusDialog";
import AddRequestDialog from "@/modules/stores/components/dialogs/add-requests/AddRequestDialog";
import { Button } from "@/components/ui/button";

function RequestsView() {
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
      <RequestStatusDialog
        open={Boolean(editingRequestId)}
        onClose={() => setEditingRequestId(null)}
        requestId={editingRequestId || undefined}
        onSuccess={() => reloadTable()}
      />

      <AddRequestDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSuccess={() => reloadTable()}
      />

      <div className="max-w-8xl mx-auto">
        {/* Table Section */}
        <TableBuilder
          config={tableConfig}
          tableId={tableConfig.tableId}
          searchBarActions={
            <Button onClick={() => setAddDialogOpen(true)}>
              {t("addNewRequest")}
            </Button>
          }
        />
      </div>
    </div>
  );
}

export default RequestsView;
