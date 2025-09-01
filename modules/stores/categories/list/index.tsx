"use client";

import { TableBuilder, useTableReload } from "@/modules/table";
import { Button } from "@/components/ui/button";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddCategoryDialog from "@/modules/stores/components/dialogs/add-category";
import { useTranslations } from "next-intl";
import { useCategoriesListTableConfig } from "./_config/list-table-config";

function ListCategoriesView() {
  const tableConfig = useCategoriesListTableConfig();
  const { reloadTable } = useTableReload(tableConfig.tableId);
  const t = useTranslations();
  return (
    <TableBuilder
      config={tableConfig}
      searchBarActions={
        <>
          <DialogTrigger
            component={AddCategoryDialog}
            dialogProps={{ onSuccess: () => reloadTable() }}
            render={({ onOpen }) => (
              <Button onClick={onOpen}>
                {t("labels.add")} {t("category.singular")}
              </Button>
            )}
          />
        </>
      }
      tableId={tableConfig.tableId}
    />
  );
}

export default ListCategoriesView;
