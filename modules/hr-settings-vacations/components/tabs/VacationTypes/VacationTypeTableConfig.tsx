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
    url: `${baseURL}/leave-types`,
    tableId: "vacation-types-table",
    columns: [
      {
        key: "name",
        label: t("name"),
        sortable: true,
        render: (_: unknown, row: VacationType) => row.name,
      },
      {
        key: "is_payed",
        label: t("isPaid"),
        sortable: true,
        render: (_: unknown, row: VacationType) => {
          return row.is_payed ? t("paid") : t("notPaid");
        },
      },
      {
        key: "isDuduct_from_balance",
        label: t("isDuduct_from_balance"),
        searchable: true,
        render: (_: unknown, row: VacationType) => {
          return row.is_deduct_from_balance ? t("duduct") : t("notDuduct");
        },
      },
      {
        key: "conditions",
        label: t("conditions"),
        sortable: true,
      },
      {
        key: "branches",
        label: t("branches"),
        sortable: true,
        render: (_: unknown, row: VacationType) => (
          <div className="flex flex-wrap gap-2">
            {row.branches.map((branch) => (
              <span
                key={branch.id}
                className="px-2 py-1 bg-gray-600 rounded text-xs"
              >
                {branch.name}
              </span>
            ))}
            {row.branches.length === 0 && "—"}
          </div>
        ),
      },
    ],
    allSearchedFields: [
      {
        key: "branch_id",
        searchType: {
          type: "dropdown",
          placeholder: t("branchesFilter"),
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
    ],
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    enableExport: can(PERMISSIONS.vacations.settings.leaveType.export),
    defaultItemsPerPage: 10,
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: ["name"],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    formConfig: getSetVacationTypeFormConfig(t, () => {}),
    executions: [],
    executionConfig: {
      canEdit: can(PERMISSIONS.vacations.settings.leaveType.update),
      canDelete: can(PERMISSIONS.vacations.settings.leaveType.delete),
    },
    deleteConfirmMessage: t("DeleteConfirmMessage"), // Custom delete confirmation message
  };
};
