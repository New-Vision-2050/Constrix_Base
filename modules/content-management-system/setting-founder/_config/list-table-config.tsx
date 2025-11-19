import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations, useLocale } from "next-intl";
import TheStatus from "../component/the-status";
import { FounderRow, TableConfigParams } from "../types";

export const useFounderListTableConfig: (
  params?: TableConfigParams
) => TableConfig = (params) => {
  const t = useTranslations("content-management-system.founder.table");
  const locale = useLocale();

  return {
    tableId: "founder-list-table",
    url: `${baseURL}/company-dashboard/founders`,
    columns: [
      {
        key: "name",
        label: t("name"),
        sortable: true,
        render: (_: unknown, row: FounderRow) => (
          <span className="font-medium">
            {locale === "ar"
              ? row.name_ar || row.name
              : row.name_en || row.name}
          </span>
        ),
      },
      {
        key: "job_title",
        label: t("jobTitle"),
        sortable: true,
        render: (_: unknown, row: FounderRow) => {
          const jobTitle =
            locale === "ar"
              ? row.job_title_ar || row.job_title
              : row.job_title_en || row.job_title;
          return (
            <span className="text-sm text-gray-400 line-clamp-2">
              {jobTitle || "-"}
            </span>
          );
        },
      },
      {
        key: "description",
        label: t("description"),
        sortable: false,
        render: (_: unknown, row: FounderRow) => {
          const description =
            locale === "ar"
              ? row.description_ar || row.description
              : row.description_en || row.description;
          return (
            <span className="text-sm text-gray-400 line-clamp-2">
              {description?.substring(0, 50)}...
            </span>
          );
        },
      },
      {
        key: "is_active",
        label: t("status"),
        render: (value: "active" | "inActive", row: FounderRow) => (
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
    deleteUrl: `${baseURL}/company-dashboard/founders`,
    searchParamName: "search",
  };
};

