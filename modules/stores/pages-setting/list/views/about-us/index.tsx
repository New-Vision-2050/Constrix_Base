"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAboutUsTableConfig } from "../../../_config/aboutUsTableConfig";
import { AboutUsDialog } from "@/modules/stores/components/dialogs/add-page-setting";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

function AboutUsView() {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const t = useTranslations("pagesSettings");

  const tableConfig = useAboutUsTableConfig({
    onEdit: (id: string) => setEditingPageId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);

  return (
    <div className="w-full" dir="rtl">
      <Can check={[PERMISSIONS.ecommerce.banner.update]}>
        <AboutUsDialog
          open={Boolean(editingPageId)}
          onClose={() => setEditingPageId(null)}
          pageId={editingPageId || undefined}
          onSuccess={() => reloadTable()}
        />
      </Can>

      <div className="max-w-8xl mx-auto">
        <TableBuilder
          config={tableConfig}
          searchBarActions={
            <Can check={[PERMISSIONS.ecommerce.banner.create]}>
              <DialogTrigger
                component={AboutUsDialog}
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
    </div>
  );
}

export default AboutUsView;
