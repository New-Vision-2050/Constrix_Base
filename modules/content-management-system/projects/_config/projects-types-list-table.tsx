import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useLocale, useTranslations } from "next-intl";
import { CMSProjectType } from "../types";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export interface ProjectTypeRow extends CMSProjectType {}

type Params = {
  onEdit?: (id: string) => void;
};

export const useProjectsTypesListTableConfig: (
  params?: Params
) => TableConfig = (params) => {
  const { can } = usePermissions();
  const t = useTranslations(
    "content-management-system.projects.projectTypesTable"
  );
  const locale = useLocale();
  const isRtl = locale === "ar";

  return {
    tableId: "company-dashboard-projects-list-table",
    url: `${baseURL}/website-project-settings`,
    columns: [
      {
        key: isRtl ? "name_ar" : "name_en",
        label: t("projectType") || "نوع المشروع",
        sortable: true,
      },
      {
        key: "website_projects_count",
        label: t("projectsCount") || "عدد المشاريع",
        sortable: true,
        render: (value: number) => (
          <span className="font-medium">{value ?? 0}</span>
        ),
      },
    ],
    executions: [
      (row) =>
        can(PERMISSIONS.CMS.projectsTypes.delete) ? (
          <DropdownMenuItem onSelect={() => params?.onEdit?.(row.id)}>
            {t("edit") || "تعديل"}
          </DropdownMenuItem>
        ) : null,
    ],
    executionConfig: {
      canDelete: can(PERMISSIONS.CMS.projectsTypes.delete),
    },
    deleteUrl: `${baseURL}/website-project-settings`,
    searchParamName: "search",
  };
};
