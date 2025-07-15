import { JobTitle } from "@/types/job-title";
import { apiClient, baseURL } from "@/config/axios-config";
import TableStatusSwitcher from "@/components/shared/table-status";
import { OrgStructureManagementsSettingsFormConfig } from "./form-config";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export const OrgStructureManagementsSettingsTableConfig = () => {
     const permissions = can(
        [PERMISSION_ACTIONS.UPDATE, PERMISSION_ACTIONS.DELETE , PERMISSION_ACTIONS.ACTIVATE , PERMISSION_ACTIONS.EXPORT],
        PERMISSION_SUBJECTS.ORGANIZATION_MANAGEMENT
      ) as {
        UPDATE: boolean;
        DELETE: boolean;
        ACTIVATE: boolean;
        EXPORT: boolean;
      };
  
  return {
    url: `${baseURL}/management_hierarchies/non-copied`,
    tableId: "OrgStructureManagementsSettingsTableConfig", // Add tableId to the config
    columns: [
     {
        key: "code_id",
        label: "كود الادارة",
      },
      {
        key: "name",
        label: "اسم الادارة",
        sortable: true,
      },
    {
        key: "departments_count",
        label: "عدد الاقسام",
        sortable: true,
      },
    {
        key: "management.name",
        label: "الادارة التابع لها",
        sortable: true,
      },
      {
        key: "users_count",
        label: "عدد الموظفين",
        sortable: true,
      },
      {
        key: "departments",
        label: "الاقسام",
        sortable: true,
      },
      {
        key: "is_active",
        label: "الحالة",
        sortable: true,
        render: (_: unknown, row: JobTitle) => (
          <TableStatusSwitcher
            id={row.id}
            label={"نشط"}
            initialStatus={row.is_active == 1}
            confirmAction={async (isActive) => {
              return await apiClient.patch(`/management_hierarchies/non-copied/${row.id}/status`, {
                is_active: Number(isActive),
              });
            }}
            confirmDescription={(isActive) =>
              !isActive ? "تغير الحالة الى غير نشط" : "تغير الحالة الى نشظ"
            }
            showDatePicker={() => false}
            canActivate={permissions.ACTIVATE}
          />
        ),
      },
    ],
    deleteConfirmMessage:"حذف  الادارة تأكيد حذف  الادارة",
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    defaultItemsPerPage: 10,
    enableSearch: true,
    enableColumnSearch: true,
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    formConfig: OrgStructureManagementsSettingsFormConfig,
    executions: [],
    executionConfig: {
      canEdit: permissions.UPDATE,
      canDelete: permissions.DELETE,
    },
    canExport: permissions.EXPORT,
  };
};
