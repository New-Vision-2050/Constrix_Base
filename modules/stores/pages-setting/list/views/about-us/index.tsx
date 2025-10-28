"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAboutUsTableConfig } from "../../../_config/aboutUsTableConfig";
import { AboutUsDialog } from "@/modules/stores/components/dialogs/add-page-setting";

function AboutUsView() {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const t = useTranslations("pagesSettings");

  const tableConfig = useAboutUsTableConfig({
    onEdit: (id: string) => setEditingPageId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);

  return (
    <div className="w-full" dir="rtl">
      <AboutUsDialog
        open={Boolean(editingPageId)}
        onClose={() => setEditingPageId(null)}
        pageId={editingPageId || undefined}
        onSuccess={() => reloadTable()}
      />

      <div className="max-w-8xl mx-auto">
        <TableBuilder
          config={tableConfig}
          searchBarActions={
            <>
              <DialogTrigger
                component={AboutUsDialog}
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
    </div>
  );
}

export default AboutUsView;
