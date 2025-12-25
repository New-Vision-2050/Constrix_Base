import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TableConfig } from "@/modules/table";
import { useTranslations, useLocale } from "next-intl";
import TheStatus from "../components/the-status";
import { ServiceRow, TableConfigParams } from "../types";
import { baseURL } from "@/config/axios-config";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export const useServiceListTableConfig: (
  params?: TableConfigParams
) => TableConfig = (params) => {
  const { can } = usePermissions();
  const t = useTranslations("content-management-system.services.table");
  const locale = useLocale();

  return {
    tableId: "service-list-table",
    url: `${baseURL}/website-services`,
    columns: [
      {
        key: "name",
        label: t("serviceName"),
        sortable: true,
        render: (_: unknown, row: ServiceRow) => (
          <span className="font-medium">
            {locale === "ar"
              ? row.name_ar || row.name
              : row.name_en || row.name}
          </span>
        ),
      },
      {
        key: "category_website_cms_id",
        label: t("category"),
        sortable: true,
        render: (_: unknown, row: ServiceRow) => (
          <span className="text-sm">{row.category?.name || "-"}</span>
        ),
      },
      {
        key: "is_active",
        label: t("visibility"),
        render: (value: "active" | "inActive", row: ServiceRow) => (
          <TheStatus theStatus={value} id={row.id} field="is_active" />
        ),
      },
      {
        key: "status",
        label: t("featured"),
        render: (value: boolean, row: ServiceRow) => (
          <TheStatus theStatus={value ? "active" : "inActive"} id={row.id} />
        ),
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem
          disabled={!can(PERMISSIONS.CMS.services.update)}
          onSelect={() => params?.onEdit?.(row.id)}
        >
          {t("edit")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: can(PERMISSIONS.CMS.services.delete),
    },
    deleteUrl: `${baseURL}/website-services`,
    searchParamName: "search",
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50],
  };
};
