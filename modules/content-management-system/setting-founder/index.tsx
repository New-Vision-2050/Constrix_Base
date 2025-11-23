"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddFounderDialog from "./add-founder-dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFounderListTableConfig } from "./_config/list-table-config";

function FounderView() {
  const [editingFounderId, setEditingFounderId] = useState<string | null>(null);
  const tableConfig = useFounderListTableConfig({
    onEdit: (id: string) => setEditingFounderId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations("content-management-system.founder");

  return (
    <div className="container p-6">
      <AddFounderDialog
        open={Boolean(editingFounderId)}
        onClose={() => setEditingFounderId(null)}
        founderId={editingFounderId || undefined}
        onSuccess={() => {
          reloadTable();
          setEditingFounderId(null);
        }}
      />
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <>
            <DialogTrigger
              component={AddFounderDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>{t("addFounder")}</Button>
              )}
            />
          </>
        }
        tableId={tableConfig.tableId}
      />
    </div>
  );
}

export default FounderView;
