"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddNewsDialog from "./add-news-dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useNewsListTableConfig } from "./_config/list-table-config";

function NewsView() {
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const tableConfig = useNewsListTableConfig({
    onEdit: (id: string) => setEditingNewsId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations("content-management-system.news");

  return (
    <div className="container p-6">
      <AddNewsDialog
        open={Boolean(editingNewsId)}
        onClose={() => setEditingNewsId(null)}
        newsId={editingNewsId || undefined}
        onSuccess={() => {
          reloadTable();
          setEditingNewsId(null);
        }}
      />
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <>
            <DialogTrigger
              component={AddNewsDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>{t("addNews")}</Button>
              )}
            />
          </>
        }
        tableId={tableConfig.tableId}
      />
    </div>
  );
}

export default NewsView;
