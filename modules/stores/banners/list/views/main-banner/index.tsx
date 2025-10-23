"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddBannerDialog from "@/modules/stores/components/dialogs/add-banner";
import { useState } from "react";
import { useBannerTableConfig } from "../../../_config/tableConfig";

function MainBannerView() {
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const tableConfig = useBannerTableConfig({
    onEdit: (id: string) => setEditingBannerId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);

  return (
    <>
      <AddBannerDialog
        open={Boolean(editingBannerId)}
        onClose={() => setEditingBannerId(null)}
        bannerId={editingBannerId || undefined}
        onSuccess={() => reloadTable()}
      />
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <>
            <DialogTrigger
              component={AddBannerDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>اضافة بانر</Button>
              )}
            />
          </>
        }
        tableId={tableConfig.tableId}
      />
    </>
  );
}

export default MainBannerView;
