import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { BranchDialog } from "@/modules/stores/components/dialogs/add-page-setting";
import { useState, useEffect, useRef } from "react";
import { useBranchTableConfig } from "../../../_config/branchTableConfig";

interface BranchesTableProps {
  onLoaded?: () => void;
}

export function BranchesTable({ onLoaded }: BranchesTableProps) {
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const initRef = useRef(false);

  const branchTableConfig = useBranchTableConfig({
    onEdit: (id: string) => setEditingBranchId(id),
  });
  const { reloadTable: reloadBranchTable } = useTableReload(branchTableConfig.tableId);

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      console.log("BranchesTable initializing");
      setMounted(true);
    }
  }, []);

  // Separate effect to call onLoaded after component is fully mounted and rendered
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        console.log("BranchesTable calling onLoaded");
        onLoaded?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mounted, onLoaded]);

  if (!mounted) {
    return null;
  }

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
          key={branchTableConfig.tableId}
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
