import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { NewFeatureDialog } from "@/modules/stores/components/dialogs/add-page-setting";
import { useState, useEffect, useRef } from "react";
import { useNewFeatureTableConfig } from "../../../_config/newFeatureTableConfig";

interface FeaturesTableProps {
  onLoaded?: () => void;
}

export function FeaturesTable({ onLoaded }: FeaturesTableProps = {}) {
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const initRef = useRef(false);

  const newFeatureTableConfig = useNewFeatureTableConfig({
    onEdit: (id: string) => setEditingFeatureId(id),
  });
  const { reloadTable: reloadFeatureTable } = useTableReload(newFeatureTableConfig.tableId);

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      console.log("FeaturesTable initializing");
      setMounted(true);
    }
  }, []);

  // Separate effect to call onLoaded after component is fully mounted and rendered
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        console.log("FeaturesTable calling onLoaded");
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
      <NewFeatureDialog
        open={Boolean(editingFeatureId)}
        onClose={() => setEditingFeatureId(null)}
        featureId={editingFeatureId || undefined}
        onSuccess={() => reloadFeatureTable()}
      />
      
      <div>
        <h2 className="text-xl font-bold text-white mb-4">ميزات جديدة</h2>
        <TableBuilder
          key={newFeatureTableConfig.tableId}
          config={newFeatureTableConfig}
          searchBarActions={
            <>
              <DialogTrigger
                component={NewFeatureDialog}
                dialogProps={{
                  onSuccess: () => reloadFeatureTable(),
                }}
                render={({ onOpen }) => (
                  <Button onClick={onOpen}>اضافة ميزة جديدة</Button>
                )}
              />
            </>
          }
          tableId={newFeatureTableConfig.tableId}
        />
      </div>
    </>
  );
}
