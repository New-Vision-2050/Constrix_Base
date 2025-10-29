"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { useState } from "react";
import { useRequestsTableConfig } from "../../_config/requestsTableConfig";
import { useTranslations } from "next-intl";
import { RequestStatusDialog } from "@/modules/stores/components/dialogs/add-requests/RequestStatusDialog";

function RequestsView() {
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const t = useTranslations("requests");

  const tableConfig = useRequestsTableConfig({
    onEdit: (id: string) => setEditingRequestId(id),
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

      <div className="max-w-8xl mx-auto">
        {/* Table Section */}
        <TableBuilder config={tableConfig} tableId={tableConfig.tableId} />
      </div>
    </div>
  );
}

export default RequestsView;
