import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations, useLocale } from "next-intl";
import TheStatus from "../components/the-status";
import { ServiceRow, TableConfigParams } from "../types";

export const useServiceListTableConfig: (
  params?: TableConfigParams
) => TableConfig = (params) => {
  const t = useTranslations("content-management-system.services.table");
  const locale = useLocale();

  return {
    tableId: "service-list-table",
    url: `${baseURL}/company-dashboard/services`,
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
        key: "category",
        label: t("category"),
        sortable: true,
        render: (_: unknown, row: ServiceRow) => (
          <span className="text-sm">
            {row.category_name || row.category || "-"}
          </span>
        ),
      },
      {
        key: "is_featured",
        label: t("type"),
        render: (value: boolean, row: ServiceRow) => (
          <TheStatus theStatus={value ? "active" : "inActive"} id={row.id} />
        ),
      },
      {
        key: "is_active",
        label: t("status"),
        render: (value: "active" | "inActive", row: ServiceRow) => (
          <TheStatus theStatus={value} id={row.id} />
        ),
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem onSelect={() => params?.onEdit?.(row.id)}>
          {t("actions")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: true,
    },
    deleteUrl: `${baseURL}/company-dashboard/services`,
    searchParamName: "search",
  };
};
