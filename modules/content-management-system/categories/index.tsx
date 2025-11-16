"use client";
import { useState } from "react";
import { CompanyDashboardCategory } from "./types";
import SetCategoryDialog from "./set-category-dialog";
import { useCategoriesListTableConfig } from "./_config/categories-table-config";
import { TableBuilder, useTableReload } from "@/modules/table";
import { useTranslations } from "next-intl";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { Button } from "@/components/ui/button";

interface CompanyDashboardCategoriesModuleProps {
    categories: CompanyDashboardCategory[];
}
export default function CompanyDashboardCategoriesModule(props: CompanyDashboardCategoriesModuleProps) {
    // Translations
    const t = useTranslations("content-management-system.categories");
    // State for editing category
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    // Table config
    const tableConfig = useCategoriesListTableConfig({
        onEdit: (id: string) => setEditingCategoryId(id),
    });
    const { reloadTable } = useTableReload(tableConfig.tableId);

    return <div className="container p-6">
        <SetCategoryDialog
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
                        component={SetCategoryDialog}
                        dialogProps={{ onSuccess: () => reloadTable() }}
                        render={({ onOpen }) => (
                            <Button onClick={onOpen}>
                                {t("addCategory")}
                            </Button>
                        )}
                    />
                </>
            }
            tableId={tableConfig.tableId}
        />
    </div>;
}