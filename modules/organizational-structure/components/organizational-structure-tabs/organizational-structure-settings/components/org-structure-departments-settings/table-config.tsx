import { JobTitle } from "@/types/job-title";
import { apiClient, baseURL } from "@/config/axios-config";
import TableStatusSwitcher from "@/components/shared/table-status";
import { OrgStructureDepartmentsSettingsFormConfig } from "./form-config";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export const OrgStructureDepartmentsSettingsTableConfig = () => {
  const permissions = can(
    [PERMISSION_ACTIONS.UPDATE, PERMISSION_ACTIONS.DELETE , PERMISSION_ACTIONS.ACTIVATE , PERMISSION_ACTIONS.EXPORT],
    PERMISSION_SUBJECTS.ORGANIZATION_DEPARTMENT
  ) as {
    UPDATE: boolean;
    DELETE: boolean;
    ACTIVATE: boolean;
    EXPORT: boolean;
  };
    
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
            canActivate={permissions.ACTIVATE}
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
      canEdit: permissions.UPDATE,
      canDelete: permissions.DELETE,
    },
    canExport: permissions.EXPORT,
  };
};
