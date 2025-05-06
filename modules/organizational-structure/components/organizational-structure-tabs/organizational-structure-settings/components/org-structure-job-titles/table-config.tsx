import { baseURL } from "@/config/axios-config";
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
        key: "email",
        label: "عدد الموظفيين",
        sortable: true,
      },
      {
        key: "company_field",
        label: "نوع الوظيفة",
        sortable: true,
      },
      {
        key: "general_manager.name",
        label: "الحالة",
        sortable: true,
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
    formConfig: GetOrgStructureSettingsFormConfig(),
    executions: [],
    executionConfig: {
      canEdit: true,
      canDelete: true,
    },
  };
};
