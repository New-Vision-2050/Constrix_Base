"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { useState, useEffect } from "react";
import { useRequestsTableConfig } from "../../_config/requestsTableConfig";
import { useTranslations } from "next-intl";
import { RequestStatusDialog } from "@/modules/stores/components/dialogs/add-requests/RequestStatusDialog";

function RequestsView() {
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const t = useTranslations("requests");

  const tableConfig = useRequestsTableConfig({
    onEdit: (id: string) => {
      setEditingRequestId(id);
      // Force dialog to open in next tick
      setTimeout(() => setDialogOpen(true), 0);
    },
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);

  // Sync dialog open state with editingRequestId
  useEffect(() => {
    setDialogOpen(Boolean(editingRequestId));
  }, [editingRequestId]);

  return (
    <div className="w-full" dir="rtl">
      <RequestStatusDialog
        open={Boolean(editingRequestId)}
        onClose={() => setEditingRequestId(null)}
        requestId={editingRequestId || undefined}
        onSuccess={() => reloadTable()}
      />

      <div className="max-w-8xl mx-auto">
        {/* Table Section */}
        <TableBuilder config={tableConfig} tableId={tableConfig.tableId} />
      </div>
    </div>
  );
}

export default RequestsView;
