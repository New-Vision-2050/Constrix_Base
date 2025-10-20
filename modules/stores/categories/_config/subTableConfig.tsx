import { baseURL } from "@/config/axios-config";

export const DiscountMockTabeConfig = () => {
  return {
    url: `${baseURL}/role_and_permissions/permissions`,
    tableId: "permissions-table",
    columns: [
      {
        key: "name",
        label: "اسم الصلاحية",
        sortable: true,
      },
      {
        key: "2",
        label: "فئة الصلاحية",
        sortable: true,
      },
      {
        key: "user_count",
        label: "عدد المستخدمين",
        sortable: true,
      },
    ],
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    defaultItemsPerPage: 5,
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: ["name", "email"],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    deleteUrl: `${baseURL}/role_and_permissions/permissions`,
    executionConfig: {
      canEdit: false,
      canDelete: false,
    },
  };
};
