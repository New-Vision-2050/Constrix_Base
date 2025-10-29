import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { BranchDialog } from "@/modules/stores/components/dialogs/add-page-setting";
import { useState } from "react";
import { useBranchTableConfig } from "../../../_config/branchTableConfig";

export function BranchesTable() {
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  const branchTableConfig = useBranchTableConfig({
    onEdit: (id: string) => {
      setEditingBranchId(id);
      // Force dialog to open in next tick to ensure state update is processed
      setTimeout(() => setEditingBranchId(id), 0);
    },
  });
  const { reloadTable: reloadBranchTable } = useTableReload(
    branchTableConfig.tableId
  );

  return (
    <>
      <BranchDialog
        open={Boolean(editingBranchId)}
        onClose={() => setEditingBranchId(null)}
        branchId={editingBranchId || undefined}
        onSuccess={() => reloadBranchTable()}
      />

      <div>
        <h2 className="text-xl font-bold text-white mb-4">الفروع</h2>
        <TableBuilder
          config={branchTableConfig}
          searchBarActions={
            <>
              <DialogTrigger
                component={BranchDialog}
                dialogProps={{
                  onSuccess: () => reloadBranchTable(),
                }}
                render={({ onOpen }) => (
                  <Button onClick={onOpen}>اضافة فرع جديد</Button>
                )}
              />
            </>
          }
          tableId={branchTableConfig.tableId}
        />
      </div>
    </>
  );
}
