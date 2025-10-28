import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { ContactDialog } from "@/modules/stores/components/dialogs/add-page-setting";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useContactTableConfig } from "../../../_config/contactTableConfig";

export function ContactBannersTable() {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  const t = useTranslations("pagesSettings");

  const tableConfig = useContactTableConfig({
    onEdit: (id: string) => setEditingPageId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);

  return (
    <>
      <ContactDialog
        open={Boolean(editingPageId)}
        onClose={() => setEditingPageId(null)}
        pageId={editingPageId || undefined}
        onSuccess={() => reloadTable()}
      />

      <div>
        <h2 className="text-xl font-bold text-white mb-4">لافتات التواصل</h2>
        <TableBuilder
          config={tableConfig}
          searchBarActions={
            <>
              <DialogTrigger
                component={ContactDialog}
                dialogProps={{
                  onSuccess: () => reloadTable(),
                }}
                render={({ onOpen }) => (
                  <Button onClick={onOpen}>{t("actions.addBanner")}</Button>
                )}
              />
            </>
          }
          tableId={tableConfig.tableId}
        />
      </div>
    </>
  );
}
