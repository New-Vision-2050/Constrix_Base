import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { NewFeatureDialog } from "@/modules/stores/components/dialogs/add-page-setting";
import { useState } from "react";
import { useNewFeatureTableConfig } from "../../../_config/newFeatureTableConfig";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";

export function FeaturesTable() {
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);

  const newFeatureTableConfig = useNewFeatureTableConfig({
    onEdit: (id: string) => {
      setEditingFeatureId(id);
      // Force dialog to open in next tick to ensure state update is processed
      setTimeout(() => setEditingFeatureId(id), 0);
    },
  });
  const { reloadTable: reloadFeatureTable } = useTableReload(
    newFeatureTableConfig.tableId
  );

  return (
    <>
      <Can check={[PERMISSIONS.ecommerce.banner.update]}>
        <NewFeatureDialog
          open={Boolean(editingFeatureId)}
          onClose={() => setEditingFeatureId(null)}
          featureId={editingFeatureId || undefined}
          onSuccess={() => reloadFeatureTable()}
        />
      </Can>

      <div>
        <TableBuilder
          config={newFeatureTableConfig}
          searchBarActions={
            <Can check={[PERMISSIONS.ecommerce.banner.create]}>
              <DialogTrigger
                component={NewFeatureDialog}
                dialogProps={{
                  onSuccess: () => reloadFeatureTable(),
                }}
                render={({ onOpen }) => (
                  <Button onClick={onOpen}>اضافة ميزة جديدة</Button>
                )}
              />
            </Can>
          }
          tableId={newFeatureTableConfig.tableId}
        />
      </div>
    </>
  );
}
