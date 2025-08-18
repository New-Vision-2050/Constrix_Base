import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { VacationType } from "@/modules/hr-settings-vacations/types/VacationType";
import { getSetVacationTypeFormConfig } from "./SetVacationTypeForm";

// Create a component that uses the translations
export const getVacationTypeTableConfig = () => {
  const t = useTranslations("HRSettingsVacations.leavesTypes.table");
  const { can } = usePermissions();

  return {
    url: `${baseURL}/vacation-types-url`,
    tableId: "vacation-types-table",
    columns: [
      {
        key: "name",
        label: t("name"),
        sortable: true,
        render: (_: unknown, row: VacationType) => row.name,
      },
      {
        key: "is_paid",
        label: t("isPaid"),
        sortable: true,
        render: (_: unknown, row: VacationType) => {
          return row.is_paid ? t("paid") : t("notPaid");
        },
      },
      {
        key: "isDuduct_from_balance",
        label: t("isDuduct_from_balance"),
        searchable: true,
        render: (_: unknown, row: VacationType) => {
          return row.is_duduct_from_balance ? t("duduct") : t("notDuduct");
        },
      },
      {
        key: "conditions",
        label: t("conditions"),
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
        key: "is_paid",
        searchType: {
          type: "dropdown",
          isMulti: true,
          placeholder: t("isPaidFilter"),
          dynamicDropdown: {
            url: `${baseURL}/vacation-types-url`,
            valueField: "id",
            isMulti: true,
            labelField: "name",
            paginationEnabled: true,
            itemsPerPage: 20,
            searchParam: "name",
            pageParam: "page",
            limitParam: "per_page",
            totalCountHeader: "x-total-count",
          },
        },
      },
      {
        key: "is_duduct_from_balance",
        searchType: {
          type: "dropdown",
          isMulti: true,
          placeholder: t("isDuductFilter"),
          dynamicDropdown: {
            url: `${baseURL}/vacation-types-url`,
            valueField: "id",
            isMulti: true,
            labelField: "name",
            paginationEnabled: true,
            itemsPerPage: 20,
            searchParam: "name",
            pageParam: "page",
            limitParam: "per_page",
            totalCountHeader: "x-total-count",
          },
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
    formConfig: getSetVacationTypeFormConfig(t),
    executions: [],
    executionConfig: {
      canEdit: true,
      canDelete: true,
    },
    deleteConfirmMessage: t("DeleteConfirmMessage"), // Custom delete confirmation message
  };
};
