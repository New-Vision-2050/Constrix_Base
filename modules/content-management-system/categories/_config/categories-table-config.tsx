import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";
import { CompanyDashboardCategory } from "../types";

export interface CategoryRow extends CompanyDashboardCategory {
  name_ar?: string;
  name_en?: string;
}

type Params = {
  onEdit?: (id: string) => void;
};

export const useCategoriesListTableConfig: (params?: Params) => TableConfig = (
  params
) => {
  const t = useTranslations("content-management-system.categories.table");

  return {
    tableId: "company-dashboard-categories-list-table",
    url: `${baseURL}/categories-website`,
    columns: [
      {
        key: "name_ar",
        label: t("nameAr") || "Category Name in Arabic",
        sortable: true,
        render: (_: unknown, row: CategoryRow) => (
          <span className="font-medium">{row.name}</span>
        ),
      },
      {
        key: "name_en",
        label: t("nameEn") || "Category Name in English",
        sortable: true,
        render: (_: unknown, row: CategoryRow) => (
          <span className="font-medium">{row.name}</span>
        ),
      },
      {
        key: "category_type",
        label: t("type") || "Type",
        sortable: true,
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem onSelect={() => params?.onEdit?.(row.id)}>
          {t("edit") || "Edit"}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: true,
    },
    deleteUrl: `${baseURL}/categories`,
    searchParamName: "search",
  };
};
