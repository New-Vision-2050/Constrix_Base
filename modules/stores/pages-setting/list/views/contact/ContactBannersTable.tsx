import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { ContactDialog } from "@/modules/stores/components/dialogs/add-page-setting";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useContactTableConfig } from "../../../_config/contactTableConfig";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export function ContactBannersTable() {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  const t = useTranslations("pagesSettings");

  const tableConfig = useContactTableConfig({
    onEdit: (id: string) => {
      setEditingPageId(id);
      // Force dialog to open in next tick to ensure state update is processed
      setTimeout(() => setEditingPageId(id), 0);
    },
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);

  return (
    <>
      <Can check={[PERMISSIONS.ecommerce.banner.update]}>
        <ContactDialog
          open={Boolean(editingPageId)}
          onClose={() => setEditingPageId(null)}
          pageId={editingPageId || undefined}
          onSuccess={() => reloadTable()}
        />
      </Can>

      <div>
        <TableBuilder
          config={tableConfig}
          searchBarActions={
            <Can check={[PERMISSIONS.ecommerce.banner.create]}>
              <DialogTrigger
                component={ContactDialog}
                dialogProps={{
                  onSuccess: () => reloadTable(),
                }}
                render={({ onOpen }) => (
                  <Button onClick={onOpen}>{t("actions.addBanner")}</Button>
                )}
              />
            </Can>
          }
          tableId={tableConfig.tableId}
        />
      </div>
    </>
  );
}
