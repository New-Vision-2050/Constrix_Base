"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddServiceDialog from "./add-service-dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useServiceListTableConfig } from "./_config/list-table-config";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function ServicesView() {
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const tableConfig = useServiceListTableConfig({
    onEdit: (id: string) => setEditingServiceId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations("content-management-system.services");

  return (
    <Can check={[PERMISSIONS.CMS.services.list]}>
      <div className="px-8 space-y-7">
        <Can check={[PERMISSIONS.CMS.services.update]}>
          <AddServiceDialog
            open={Boolean(editingServiceId)}
            onClose={() => setEditingServiceId(null)}
            serviceId={editingServiceId || undefined}
            onSuccess={() => {
              reloadTable();
              setEditingServiceId(null);
            }}
          />
        </Can>
        <TableBuilder
          config={tableConfig}
          searchBarActions={
            <Can check={[PERMISSIONS.CMS.services.create]}>
              <DialogTrigger
                component={AddServiceDialog}
                dialogProps={{ onSuccess: () => reloadTable() }}
                render={({ onOpen }) => (
                  <Button onClick={onOpen}>{t("addService")}</Button>
                )}
              />
            </Can>
          }
          tableId={tableConfig.tableId}
        />
      </div>
    </Can>
  );
}
