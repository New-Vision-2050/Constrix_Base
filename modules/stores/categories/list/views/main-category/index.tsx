"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddCategoryDialog from "@/modules/stores/components/dialogs/add-category";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useMainCategoryTableConfig } from "../../../_config/mainTableConfig";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

function MainCategoriesView() {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const tableConfig = useMainCategoryTableConfig({
    onEdit: (id: string) => setEditingCategoryId(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();
  return (
    <>
      <Can check={[PERMISSIONS.ecommerce.category.update]}>
        <AddCategoryDialog
          open={Boolean(editingCategoryId)}
          onClose={() => setEditingCategoryId(null)}
          categoryId={editingCategoryId || undefined}
          onSuccess={() => reloadTable()}
        />
      </Can>

      <TableBuilder
        config={tableConfig}
        searchBarActions={
          <Can check={[PERMISSIONS.ecommerce.category.create]}>
            <DialogTrigger
              component={AddCategoryDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>اضافة قسم</Button>
              )}
            />
          </Can>
        }
        tableId={tableConfig.tableId}
      />
    </>
  );
}

export default MainCategoriesView;
