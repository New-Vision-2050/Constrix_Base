import { baseURL } from "@/config/axios-config";
import { GetOrgStructureSettingsJobTypesFormConfig } from "./form-config";


export const OrgStructureSettingsJobTypesTableConfig = () => {
  return {
    url: `${baseURL}/job_types`,
    tableId: "org-structure-job-types-table", // Add tableId to the config
    columns: [
      {
        key: "job_type",
        label: "نوع الوظيفة",
        sortable: true,
      },
      {
        key: "email",
        label: "عدد الموظفيين",
        sortable: true,
      },
      {
        key: "job_titles",
        label: "المسميات الوظيفية",
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
    formConfig: GetOrgStructureSettingsJobTypesFormConfig(),
    executions: [],
    executionConfig: {
      canEdit: true,
      canDelete: true,
    },
  };
};
