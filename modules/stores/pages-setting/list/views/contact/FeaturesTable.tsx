import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { NewFeatureDialog } from "@/modules/stores/components/dialogs/add-page-setting";
import { useState } from "react";
import { useNewFeatureTableConfig } from "../../../_config/newFeatureTableConfig";

export function FeaturesTable() {
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);

  const newFeatureTableConfig = useNewFeatureTableConfig({
    onEdit: (id: string) => setEditingFeatureId(id),
  });
  const { reloadTable: reloadFeatureTable } = useTableReload(
    newFeatureTableConfig.tableId
  );

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
