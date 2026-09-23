import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { PublicVacation } from "@/modules/hr-settings-vacations/types/PublicVacation";
import { toMonthDay } from "@/modules/hr-settings-vacations/utils/holiday-dates";
import { getSetPublicVacationFormConfig } from "./SetPublicVacationFormConfig";

type TableFilters = {
  year?: number | null;
  branchId?: string | number | null;
  onMutateSuccess?: () => void;
};

const MONTH_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export const getPublicVacationTableConfig = (filters?: TableFilters) => {
  const t = useTranslations("HRSettingsVacations.publicLeaves.table");
  const { can } = usePermissions();
  const apiParams: Record<string, string> = {};

  if (filters?.year) {
    apiParams.year = String(filters.year);
  }
  if (filters?.branchId) {
    apiParams.branch_id = String(filters.branchId);
  }

  const query = new URLSearchParams(apiParams).toString();

  return {
    url: `${baseURL}/public-holidays${query ? `?${query}` : ""}`,
    tableId: "public-vacations-table",
    apiParams,
    dataPath: "payload",
    columns: [
      {
        key: "name",
        label: t("name"),
        sortable: true,
        render: (_: unknown, row: PublicVacation) => row.name,
      },
      {
        key: "date_start",
        label: t("startDate"),
        sortable: true,
        render: (_: unknown, row: PublicVacation) => row.date_start || "—",
      },
      {
        key: "date_end",
        label: t("endDate"),
        sortable: true,
        render: (_: unknown, row: PublicVacation) => row.date_end || "—",
      },
      {
        key: "count_days",
        label: t("daysCount"),
        sortable: false,
        render: (_: unknown, row: PublicVacation) =>
          row.count_days != null ? row.count_days : "—",
      },
    ],
    allSearchedFields: [
      {
        key: "month",
        label: t("monthFilter"),
        searchType: {
          type: "dropdown",
          placeholder: t("monthFilter"),
          dropdownOptions: MONTH_VALUES.map((month) => ({
            value: String(month),
            label: t(`months.${month}`),
          })),
        },
      },
      {
        key: "date_start",
        label: t("startDate"),
        searchType: {
          type: "date",
          placeholder: t("startDateFilter"),
          transformValue: (value: string) => toMonthDay(value) ?? "",
        },
      },
      {
        key: "date_end",
        label: t("endDate"),
        searchType: {
          type: "date",
          placeholder: t("endDateFilter"),
          transformValue: (value: string) => toMonthDay(value) ?? "",
        },
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
    formConfig: getSetPublicVacationFormConfig(t, filters?.onMutateSuccess, {
      year: filters?.year ?? new Date().getFullYear(),
      branchId: filters?.branchId,
      isEdit: true,
    }),
    executions: [],
    executionConfig: {
      canEdit: can(PERMISSIONS.vacations.settings.publicHoliday.update),
      canDelete: can(PERMISSIONS.vacations.settings.publicHoliday.delete),
    },
    onDeleteSuccess: filters?.onMutateSuccess,
    onEditSuccess: filters?.onMutateSuccess,
    deleteConfirmMessage: t("DeleteConfirmMessage"),
  };
};
