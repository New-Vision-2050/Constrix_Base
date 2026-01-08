import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";
import { CompanyDashboardCategory } from "../types";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

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
  const { can } = usePermissions();
  const t = useTranslations("content-management-system.categories.table");

  return {
    tableId: "company-dashboard-categories-list-table",
    url: `${baseURL}/categories-website`,
    columns: [
      {
        key: "name_ar",
        label: t("nameAr") || "Category Name in Arabic",
        sortable: true
      },
      {
        key: "name_en",
        label: t("nameEn") || "Category Name in English",
        sortable: true
      },
      {
        key: "category_type.name",
        label: t("type") || "Type",
        sortable: true,
        searchable:true
      },
    ],
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: [],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    allSearchedFields: [
      {
        key: "category_type",
        searchType: {
          type: "dropdown",
          placeholder: t("searchType"),
          dynamicDropdown: {
            url: `${baseURL}/categories-website/categeory-types`,
            valueField: "id",
            labelField: "name",
            paginationEnabled: true,
            itemsPerPage: 10,
            searchParam: "name",
            pageParam: "page",
            limitParam: "per_page",
            totalCountHeader: "x-total-count",
          },
        },
      }
    ],
    executions: [
      (row) => (
        <DropdownMenuItem disabled={!can(PERMISSIONS.CMS.categories.update)} onSelect={() => params?.onEdit?.(row.id)}>
          {t("edit") || "Edit"}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: can(PERMISSIONS.CMS.categories.delete),
    },
    deleteUrl: `${baseURL}/categories-website`,
    deleteConfirmMessage: t("deleteCategoryConfirm"),
  };
};
