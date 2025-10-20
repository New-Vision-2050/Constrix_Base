"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddCategoryDialog from "@/modules/stores/components/dialogs/add-category";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMainCategoryTableConfig } from "../../../_config/mainTableConfig";

function ListCategoriesView() {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [addingChildTo, setAddingChildTo] = useState<string | null>(null);
  const tableConfig = useMainCategoryTableConfig({
    onEdit: (id: string) => setEditingCategoryId(id),
    onAddChild: (id: string) => setAddingChildTo(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();
  return (
    <>
      <AddCategoryDialog
        open={Boolean(editingCategoryId)}
        onClose={() => setEditingCategoryId(null)}
        categoryId={editingCategoryId || undefined}
        onSuccess={() => reloadTable()}
      />
      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <>
            <DialogTrigger
              component={AddCategoryDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>اضافة قسم</Button>
              )}
            />
          </>
        }
        tableId={tableConfig.tableId}
      />
    </>
  );
}

export default ListCategoriesView;
