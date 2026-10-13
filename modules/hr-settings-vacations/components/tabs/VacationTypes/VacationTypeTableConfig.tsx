import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { VacationType } from "@/modules/hr-settings-vacations/types/VacationType";
import { getSetVacationTypeFormConfig } from "./SetVacationTypeForm";
import { useQueryClient } from "@tanstack/react-query";
import { LEAVE_TYPES_OPTIONS_QUERY_KEY } from "@/modules/hr-settings-vacations/hooks/useLeaveTypes";

// Create a component that uses the translations
export const getVacationTypeTableConfig = () => {
  const t = useTranslations("HRSettingsVacations.leavesTypes.table");
  const { can } = usePermissions();
  const queryClient = useQueryClient();
  const refreshLeaveTypeOptions = () =>
    queryClient.invalidateQueries({ queryKey: LEAVE_TYPES_OPTIONS_QUERY_KEY });

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
          return Number(row.is_payed) ? t("paid") : t("notPaid");
        },
      },
      {
        key: "is_deduct_from_balance",
        label: t("isDuduct_from_balance"),
        searchable: true,
        render: (_: unknown, row: VacationType) => {
          return Number(row.is_deduct_from_balance) ? t("duduct") : t("notDuduct");
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
    formConfig: getSetVacationTypeFormConfig(t, refreshLeaveTypeOptions),
    onEditSuccess: refreshLeaveTypeOptions,
    onDeleteSuccess: refreshLeaveTypeOptions,
    executions: [],
    executionConfig: {
      canEdit: can(PERMISSIONS.vacations.settings.leaveType.update),
      canDelete: can(PERMISSIONS.vacations.settings.leaveType.delete),
    },
    deleteConfirmMessage: t("DeleteConfirmMessage"),
  };
};
