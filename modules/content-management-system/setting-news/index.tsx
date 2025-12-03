"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddNewsDialog from "./add-news-dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useNewsListTableConfig } from "./_config/list-table-config";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

function NewsView() {
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const tableConfig = useNewsListTableConfig({
    onEdit: (id: string) => setEditingNewsId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations("content-management-system.news");

  return (
    <Can check={[PERMISSIONS.CMS.news.list]}>
      <div className="px-8 space-y-7">
        <Can check={[PERMISSIONS.CMS.news.update]}>
          <AddNewsDialog
            open={Boolean(editingNewsId)}
            onClose={() => setEditingNewsId(null)}
            newsId={editingNewsId || undefined}
            onSuccess={() => {
              reloadTable();
              setEditingNewsId(null);
            }}
          />
        </Can>
        <TableBuilder
          config={tableConfig}
          searchBarActions={
            <Can check={[PERMISSIONS.CMS.news.create]}>
              <DialogTrigger
                component={AddNewsDialog}
                dialogProps={{ onSuccess: () => reloadTable() }}
                render={({ onOpen }) => (
                  <Button onClick={onOpen}>{t("addNews")}</Button>
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

export default NewsView;
