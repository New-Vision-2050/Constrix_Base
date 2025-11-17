import { useTranslations } from "next-intl";
import { useState } from "react";
import { useProjectsTypesListTableConfig } from "../../_config/projects-types-list-table";
import { TableBuilder, useTableReload } from "@/modules/table";

export default function ProjectTypesTable() {
    // Translations
    const t = useTranslations("content-management-system.categories");
    // State for editing ProjectType
    const [editingProjectTypeId, setEditingProjectTypeId] = useState<string | null>(null);
    // Table config
    const tableConfig = useProjectsTypesListTableConfig({
        onEdit: (id: string) => setEditingProjectTypeId(id),
    });
    const { reloadTable } = useTableReload(tableConfig.tableId);

    return <div className="container p-6">
        {/* <SetCategoryDialog
            open={Boolean(editingCategoryId)}
            onClose={() => setEditingCategoryId(null)}
            categoryId={editingCategoryId || undefined}
            onSuccess={() => reloadTable()}
        /> */}
        <TableBuilder
            config={tableConfig}
            searchBarActions={
                <>
                    {/* <DialogTrigger
                        component={SetCategoryDialog}
                        dialogProps={{ onSuccess: () => reloadTable() }}
                        render={({ onOpen }) => (
                            <Button onClick={onOpen}>
                                {t("addCategory")}
                            </Button>
                        )}
                    /> */}
                </>
            }
            tableId={tableConfig.tableId}
        />
    </div>;
}