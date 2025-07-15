import { JobTitle } from "@/types/job-title";
import { apiClient, baseURL } from "@/config/axios-config";
import { OrgStructureSettingsFormConfig } from "./form-config";
import TableStatusSwitcher from "@/components/shared/table-status";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export const OrgStructureSettingsTableConfig = () => {
  const permissions = can(
    [PERMISSION_ACTIONS.UPDATE, PERMISSION_ACTIONS.DELETE , PERMISSION_ACTIONS.ACTIVATE , PERMISSION_ACTIONS.EXPORT],
    PERMISSION_SUBJECTS.ORGANIZATION_JOB_TITLE
  ) as {
    UPDATE: boolean;
    DELETE: boolean;
    ACTIVATE: boolean;
    EXPORT: boolean;
  };
  return {
    url: `${baseURL}/job_titles`,
    tableId: "org-structure-job-titles-table", // Add tableId to the config
    columns: [
      {
        key: "name",
        label: "المسمي الوظيفي",
        sortable: true,
      },
      {
        key: "user_count",
        label: "عدد الموظفيين",
        sortable: true,
      },
      {
        key: "job_type.name",
        label: "نوع الوظيفة",
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
              return await apiClient.patch(`/job_titles/${row.id}/status`, {
                status: Number(isActive),
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
    deleteConfirmMessage:"حذف  المسمي الوظيفي تأكيد حذف  المسمي الوظيفي",
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
    formConfig: OrgStructureSettingsFormConfig,
    executions: [],
    executionConfig: {
      canEdit: permissions.UPDATE,
      canDelete: permissions.DELETE,
    },
    canExport: permissions.EXPORT,
  };
};
