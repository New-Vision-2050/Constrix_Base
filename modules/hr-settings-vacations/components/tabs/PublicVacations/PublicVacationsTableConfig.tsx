import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { PublicVacation } from "@/modules/hr-settings-vacations/types/PublicVacation";
import { getSetPublicVacationFormConfig } from "./SetPublicVacationFormConfig";

// Create a component that uses the translations
export const getPublicVacationTableConfig = () => {
  const t = useTranslations("HRSettingsVacations.publicLeaves.table");
  const { can } = usePermissions();

  return {
    url: `${baseURL}/public-holidays`,
    tableId: "public-vacations-table",
    columns: [
      {
        key: "name",
        label: t("name"),
        sortable: true,
        render: (_: unknown, row: PublicVacation) => row.name,
      },
      {
        key: "country.name",
        label: t("country"),
        sortable: true,
      },
      {
        key: "date_start",
        label: t("startDate"),
        sortable: true,
      },
      {
        key: "date_end",
        label: t("endDate"),
        sortable: true,
      }
    ],
    allSearchedFields: [
      {
        key: "country_id",
        searchType: {
          type: "dropdown",
          placeholder: t("countryFilter"),
          dynamicDropdown: {
            url: `${baseURL}/countries`,
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
      },
      {
        key: "date_start",
        searchType: {
          type: "date",
          placeholder: t("startDateFilter")
        },
      },
      {
        key: "date_end",
        searchType: {
          type: "date",
          placeholder: t("endDateFilter")
        },
      },
    ],
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    // enableExport: can(PERMISSIONS.company.export),
    defaultItemsPerPage: 10,
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: ["name"],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    formConfig: getSetPublicVacationFormConfig(t),
    executions: [],
    executionConfig: {
      canEdit: false,
      canDelete: true,
    },
    deleteConfirmMessage: t("DeleteConfirmMessage"), // Custom delete confirmation message
  };
};