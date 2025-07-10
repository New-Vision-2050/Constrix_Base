import { JobTitle } from "@/types/job-title";
import { apiClient, baseURL } from "@/config/axios-config";
import TableStatusSwitcher from "@/components/shared/table-status";
import { OrgStructureDepartmentsSettingsFormConfig } from "./form-config";

export const OrgStructureDepartmentsSettingsTableConfig = () => {
  return {
    url: `${baseURL}/management_hierarchies/non-copied?type=department`,
    tableId: "OrgStructureDepartmentsSettingsTableConfig",
    columns: [
      {
        key: "code",
        label: "كود القسم",
      },
      {
        key: "name",
        label: "اسم القسم",
        sortable: true,
      },
      {
        key: "management_name",
        label: "الادارة التابع لها القسم",
        sortable: true,
      },
      {
        key: "user_count",
        label: "عدد الموظفيين",
        sortable: true,
      },
      {
        key: "branches",
        label: "الفروع التابع لها القسم",
        sortable: true,
      },
      {
        key: "status",
        label: "الحالة",
        sortable: true,
        render: (_: unknown, row: JobTitle) => (
          <TableStatusSwitcher
            id={row.id}
            label={"نشط"}
            initialStatus={row.status == 1}
            confirmAction={async (isActive) => {
              return await apiClient.patch(`/write-url/${row.id}/status`, {
                status: Number(isActive),
              });
            }}
            confirmDescription={(isActive) =>
              !isActive ? "تغير الحالة الى غير نشط" : "تغير الحالة الى نشط"
            }
            showDatePicker={() => false}
          />
        ),
      },
    ],
    deleteConfirmMessage: "تأكيد حذف القسم",
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    defaultItemsPerPage: 10,
    enableSearch: true,
    enableColumnSearch: true,
    searchParamName: "search",
    searchFieldParamName: "fields",
    formConfig: OrgStructureDepartmentsSettingsFormConfig,
    allowSearchFieldSelection: true,
    executionConfig: {
      canEdit: true,
      canDelete: true,
    },
  };
};
