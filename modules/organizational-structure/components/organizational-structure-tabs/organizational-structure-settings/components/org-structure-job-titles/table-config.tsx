import { JobTitle } from "@/types/job-title";
import { baseURL } from "@/config/axios-config";
import { Label } from "@/modules/table/components/ui/label";
import { Switch } from "@/modules/table/components/ui/switch";
import { GetOrgStructureSettingsFormConfig } from "./form-config";

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
          <div className="flex items-center gap-2">
            <Label htmlFor={`${row.id}-switcher`} className="font-normal">
              نشط
            </Label>
            <Switch id={`${row.id}-switcher`} checked={row.status == 1} />
          </div>
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
