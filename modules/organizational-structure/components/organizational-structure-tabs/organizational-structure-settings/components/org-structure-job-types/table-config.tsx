import { apiClient, baseURL } from "@/config/axios-config";
import { GetOrgStructureSettingsJobTypesFormConfig } from "./form-config";
import { JobType } from "@/types/job-type";
import TableStatusSwitcher from "@/components/shared/table-status";

export const OrgStructureSettingsJobTypesTableConfig = () => {
  return {
    url: `${baseURL}/job_types`,
    tableId: "org-structure-job-types-table", // Add tableId to the config
    columns: [
      {
        key: "name",
        label: "نوع الوظيفة",
        sortable: true,
      },
      {
        key: "user_count",
        label: "عدد الموظفيين",
        sortable: true,
      },
      {
        key: "job_titles",
        label: "المسميات الوظيفية",
        sortable: true,
        render: (_: unknown, row: JobType) => {
          return (
            <div className="flex flex-col">
              {row?.job_titles?.length == 0 && <span>--</span>}
              {row?.job_titles?.map((item) => (
                <p key={item.id}>{item.name}</p>
              ))}
            </div>
          );
        },
      },
      {
        key: "status",
        label: "الحالة",
        sortable: true,
        render: (_: unknown, row: JobType) => (
          <TableStatusSwitcher
            id={row.id}
            label={"نشط"}
            initialStatus={row.status == 1}
            confirmAction={async (isActive) => {
              return await apiClient.patch(`/job_types/${row.id}/status`, {
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
    searchFields: ["name", "email"],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    formConfig: GetOrgStructureSettingsJobTypesFormConfig(),
    executions: [],
    executionConfig: {
      canEdit: true,
      canDelete: true,
    },
  };
};
