import { JobTitle } from "@/types/job-title";
import { apiClient, baseURL } from "@/config/axios-config";
import { GetOrgStructureSettingsFormConfig } from "./form-config";
import TableStatusSwitcher from "@/components/shared/table-status";

export const OrgStructureSettingsTableConfig = () => {
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
          />
        ),
      },
    ],
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
    formConfig: GetOrgStructureSettingsFormConfig(),
    executions: [],
    executionConfig: {
      canEdit: true,
      canDelete: true,
    },
  };
};
