import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { LeavePolicyCategory } from "@/modules/hr-settings-vacations/types/LeavePolicyCategory";
import { getSetLeavePolicyCategoryFormConfig } from "./SetLeavePolicyCategoryForm";
import { useQueryClient } from "@tanstack/react-query";
import { LEAVE_POLICY_CATEGORIES_OPTIONS_QUERY_KEY } from "@/modules/hr-settings-vacations/hooks/useLeavePolicyCategories";

export const getLeavePolicyCategoryTableConfig = () => {
  const t = useTranslations("HRSettingsVacations.leavePolicyCategories.table");
  const { can } = usePermissions();
  const queryClient = useQueryClient();
  const refreshOptions = () => {
    queryClient.invalidateQueries({
      queryKey: LEAVE_POLICY_CATEGORIES_OPTIONS_QUERY_KEY,
    });
    queryClient.invalidateQueries({ queryKey: ["vacation-policies-data"] });
  };

  return {
    url: `${baseURL}/leave-policy-categories`,
    tableId: "leave-policy-categories-table",
    columns: [
      {
        key: "name",
        label: t("name"),
        sortable: true,
        render: (_: unknown, row: LeavePolicyCategory) => row.name,
      },
    ],
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    defaultItemsPerPage: 10,
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: ["name"],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    formConfig: getSetLeavePolicyCategoryFormConfig(t, refreshOptions),
    onEditSuccess: refreshOptions,
    onDeleteSuccess: refreshOptions,
    executions: [],
    executionConfig: {
      canEdit: can(PERMISSIONS.vacations.settings.leavePolicyCategory.update),
      canDelete: can(PERMISSIONS.vacations.settings.leavePolicyCategory.delete),
    },
    deleteConfirmMessage: t("DeleteConfirmMessage"),
  };
};
