import { JobTitle } from "@/types/job-title";
import { apiClient, baseURL } from "@/config/axios-config";
import TableStatusSwitcher from "@/components/shared/table-status";
import { OrgStructureManagementsSettingsFormConfig } from "./form-config";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export const OrgStructureManagementsSettingsTableConfig = () => {
  const {can} = usePermissions()
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
            disabled={!can(PERMISSIONS.organization.management.activate)}
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
    enableExport: can(PERMISSIONS.organization.management.export),
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    formConfig: OrgStructureManagementsSettingsFormConfig,
    executions: [],
    executionConfig: {
      canEdit: can(PERMISSIONS.organization.management.update),
      canDelete: can(PERMISSIONS.organization.management.delete),
    },
  };
};
