import { baseURL } from "@/config/axios-config";

export const UserProjectsTableConfig = () => {
  return {
    url: `${baseURL}/user-projects`,
    tableId: "user-projects-table",
    columns: [
      {
        key: "name",
        label: "المشروع",
        sortable: true,
        searchable: true,
      },
      {
        key: "name",
        label: "عدد المهام",
      },
      {
        key: "name",
        label: "نسبة الانجاز",
      },
      {
        key: "name",
        label: "الساعات",
      },
    ],
    allSearchedFields: [],
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    defaultItemsPerPage: 5,
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: ["name"],
    searchParamName: "q",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
  };
};
