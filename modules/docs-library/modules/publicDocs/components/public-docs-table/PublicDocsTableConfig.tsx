import { baseURL } from "@/config/axios-config";

// Create a component that uses the translations
export const getPublicDocsTableConfig = () => {

  return {
    url: `${baseURL}/public-docs`,
    tableId: "public-docs-table",
    columns: [
      {
        key: "file_name",
        label: 'الملف',
        sortable: true,
      },
      {
        key: "sorted_by",
        label: 'تم التعديل بواسطة',
        sortable: true,
      },
      {
        key: "file_size",
        label: 'حجم الملف',
        sortable: true,
      },
      {
        key: "docs_count",
        label: 'عدد المستندات',
        sortable: true,
      },
      {
        key: "file_type",
        label: 'سمة الملف',
        sortable: true,
      },
      {
        key: "last_activity",
        label: 'اخر نشاط',
        sortable: true,
      },
      {
        key: "status",
        label: 'الحالة',
        sortable: true,
      },
      {
        key: "settings",
        label: 'الاعدادات',
        sortable: true,
      }
    ],
    allSearchedFields: [],
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    enableExport: false,
    defaultItemsPerPage: 10,
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: ["name"],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    executions: [],
    executionConfig: {
      canEdit: false,
      canDelete: false,
    },
    deleteConfirmMessage: "",
  };
};
