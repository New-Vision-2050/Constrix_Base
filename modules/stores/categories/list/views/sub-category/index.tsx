"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { useTranslations } from "next-intl";
import { useState } from "react";
import AddSubCategoryDialog from "@/modules/stores/components/dialogs/add-category/addSubCategory";
import { useSubCategoryTableConfig } from "../../../_config/subTableConfig";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

function SubCategoriesView() {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [addingChildTo, setAddingChildTo] = useState<string | null>(null);
  const tableConfig = useSubCategoryTableConfig({
    onEdit: (id: string) => setEditingCategoryId(id),
    onAddChild: (id: string) => setAddingChildTo(id),
  });
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();
  return (
    <>
      <Can check={[PERMISSIONS.ecommerce.category.update]}>
        <AddSubCategoryDialog
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
              component={AddSubCategoryDialog}
              dialogProps={{ onSuccess: () => reloadTable() }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>اضافة قسم فرعي </Button>
              )}
            />
          </Can>
        }
        tableId={tableConfig.tableId}
      />
    </>
  );
}

export default SubCategoriesView;
