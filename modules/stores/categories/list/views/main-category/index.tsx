"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import AddCategoryDialog from "@/modules/stores/components/dialogs/add-category";
import { MainCategoriesTableV2 } from "./table-v2/MainCategoriesTableV2";

/**
 * Main Categories View - V2 Implementation
 * Uses HeadlessTable with Two-Hook Pattern for better performance
 */
function MainCategoriesView() {
  const t = useTranslations("stores.mainCategories");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  return (
    <>
      <Can check={[PERMISSIONS.ecommerce.category.update]}>
        <AddCategoryDialog
          open={Boolean(editingCategoryId)}
          onClose={() => setEditingCategoryId(null)}
          categoryId={editingCategoryId || undefined}
          onSuccess={() => {
            // Refetch will be handled by the table component
            setEditingCategoryId(null);
          }}
        />
      </Can>
      
      <MainCategoriesTableV2 />
    </>
  );
}

export default MainCategoriesView;
