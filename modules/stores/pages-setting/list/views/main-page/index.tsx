"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { useState } from "react";
import { useMainPageTableConfig } from "../../../_config/mainPageTableConfig";
import { MainPageDialog } from "@/modules/stores/components/dialogs/add-page-setting";
import { useTranslations } from "next-intl";

function MainPageView() {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const t = useTranslations("pagesSettings");

  const tableConfig = useMainPageTableConfig({
    onEdit: (id: string) => setEditingPageId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);

  return (
    <div className="w-full" dir="rtl">
      <MainPageDialog
        open={Boolean(editingPageId)}
        onClose={() => setEditingPageId(null)}
        pageId={editingPageId || undefined}
        onSuccess={() => reloadTable()}
      />

      <div className="max-w-8xl mx-auto">
        {/* Table Section */}
        <TableBuilder
          config={tableConfig}
          searchBarActions={
            <>
              <DialogTrigger
                component={MainPageDialog}
                dialogProps={{
                  onSuccess: () => reloadTable()
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
    </div>
  );
}

export default MainPageView;
