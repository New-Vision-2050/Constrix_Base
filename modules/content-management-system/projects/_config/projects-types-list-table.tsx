import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";
import { CMSProjectType } from "../types";


export interface ProjectTypeRow extends CMSProjectType { }

type Params = {
    onEdit?: (id: string) => void;
};

export const useProjectsTypesListTableConfig: (params?: Params) => TableConfig = (
    params
) => {
    const t = useTranslations("content-management-system.projects.projectTypesTable");

    return {
        tableId: "company-dashboard-projects-list-table",
        url: `${baseURL}/company-dashboard/projects-types/list`,
        columns: [
            {
                key: "type",
                label: t("projectType") || "نوع المشروع",
                sortable: true,
                render: (value: string) => (
                    <span className="font-medium">
                        {value || "-"}
                    </span>
                ),
            },
            {
                key: "projects_count",
                label: t("projectsCount") || "عدد المشاريع",
                sortable: true,
                render: (value: number) => (
                    <span className="font-medium">{value ?? 0}</span>
                ),
            },
            {
                key: "group",
                label: t("group") || "المجموعة",
                sortable: true,
                render: (value: number) => (
                    <span className="font-medium">{value ?? "-"}</span>
                ),
            },
        ],
        executions: [
            (row) => (
                <DropdownMenuItem onSelect={() => params?.onEdit?.(row.id)}>
                    {t("edit") || "تعديل"}
                </DropdownMenuItem>
            ),
        ],
        executionConfig: {
            canDelete: true,
        },
        deleteUrl: `${baseURL}/company-dashboard/projects`,
        searchParamName: "search",
    };
};
