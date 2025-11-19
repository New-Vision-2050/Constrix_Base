import { useTranslations } from "next-intl";
import { useState } from "react";
import { useProjectsTypesListTableConfig } from "../../_config/projects-types-list-table";
import { TableBuilder, useTableReload } from "@/modules/table";
import SetProjectTypeDialog from "../SetProjectTypeDialog";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { Button } from "@/components/ui/button";

export default function ProjectTypesTable() {
    // Translations
    const t = useTranslations("content-management-system.projects.projectTypesTable");
    // State for editing ProjectType
    const [editingProjectTypeId, setEditingProjectTypeId] = useState<string | null>(null);
    // Table config
    const tableConfig = useProjectsTypesListTableConfig({
        onEdit: (id: string) => setEditingProjectTypeId(id),
    });
    const { reloadTable } = useTableReload(tableConfig.tableId);

    return <div className="container p-6">
        <SetProjectTypeDialog
            open={Boolean(editingProjectTypeId)}
            onClose={() => setEditingProjectTypeId(null)}
            projectTypeId={editingProjectTypeId || undefined}
            onSuccess={() => reloadTable()}
        />
        <TableBuilder
            config={tableConfig}
            searchBarActions={
                <>
                    <DialogTrigger
                        component={SetProjectTypeDialog}
                        dialogProps={{ onSuccess: () => reloadTable() }}
                        render={({ onOpen }) => (
                            <Button onClick={onOpen}>
                                {t("addProjectType")}
                            </Button>
                        )}
                    />
                </>
            }
            tableId={tableConfig.tableId}
        />
    </div>;
}
