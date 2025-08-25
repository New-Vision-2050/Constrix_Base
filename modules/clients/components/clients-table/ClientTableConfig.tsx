import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

// Create a component that uses the translations
export const getClientTableConfig = () => {
  const { can } = usePermissions();
  const t = useTranslations("ClientsModule.table");

  return {
    url: `${baseURL}/company-users/clients`,
    tableId: "clients-table",
    columns: [
      {
        key: "name",
        label: t("columns.name"),
        sortable: true,
      },
      {
        key: "identity",
        label: t("columns.identity"),
        sortable: true,
      },
      {
        key: "email",
        label: t("columns.email"),
        sortable: true,
      },
      {
        key: "phone",
        label: t("columns.phone"),
        sortable: true,
      },
      {
        key: "branches",
        label: t("columns.branches"),
        sortable: true,
      },
      {
        key: "broker",
        label: t("columns.broker"),
        sortable: true,
      },
      {
        key: "projectsNumber",
        label: t("columns.projectsNumber"),
        sortable: true,
      },
      {
        key: "status",
        label: t("columns.status"),
      },
    ],
    allSearchedFields: [
      {
        key: "branch_id",
        searchType: {
          type: "dropdown",
          placeholder: t("filters.branchesFilter"),
          dynamicDropdown: {
            url: `${baseURL}/management_hierarchies/list?type=branch`,
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
        key: "status",
        searchType: {
          type: "dropdown",
          placeholder: t("filters.statusFilter"),
          options: [
            { value: "active", label: t("active") },
            { value: "inactive", label: t("inactive") },
          ],
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
    // formConfig: getSetPublicVacationFormConfig(t),
    executions: [],
    executionConfig: {
      canEdit: true,
      canDelete: true,
    },
    deleteConfirmMessage: t("DeleteConfirmMessage"), // Custom delete confirmation message
  };
};
