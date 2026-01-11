"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddFounderDialog from "./add-founder-dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFounderListTableConfig } from "./_config/list-table-config";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import FounderViewV2 from "./FounderViewV2";

function FounderView() {
  const [editingFounderId, setEditingFounderId] = useState<string | null>(null);
  const tableConfig = useFounderListTableConfig({
    onEdit: (id: string) => setEditingFounderId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations("content-management-system.founder");

  return (
    <Can check={[PERMISSIONS.CMS.founder.list]}>
      {/* <div className="px-8 space-y-7">
        <Can check={[PERMISSIONS.CMS.founder.update]}>
          <AddFounderDialog
            open={Boolean(editingFounderId)}
            onClose={() => setEditingFounderId(null)}
            founderId={editingFounderId || undefined}
            onSuccess={() => {
              reloadTable();
              setEditingFounderId(null);
            }}
          />
        </Can>
        <TableBuilder
          config={tableConfig}
          searchBarActions={
            <Can check={[PERMISSIONS.CMS.founder.create]}>
              <DialogTrigger
                component={AddFounderDialog}
                dialogProps={{ onSuccess: () => reloadTable() }}
                render={({ onOpen }) => (
                  <Button onClick={onOpen}>{t("addFounder")}</Button>
                )}
              />
            </Can>
          }
          tableId={tableConfig.tableId}
        />
      </div> */}
      <FounderViewV2 />
    </Can>
  );
}

export default FounderView;
