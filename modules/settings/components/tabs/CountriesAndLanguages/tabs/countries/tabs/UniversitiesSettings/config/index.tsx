import { baseURL } from "@/config/axios-config";

export const UniversitiesTableConfig = () => {
  return {
    url: `${baseURL}/universities`,
    tableId: "universities-table",
    columns: [
      {
        key: "name",
        label: "أسم الجامعة",
        sortable: true,
        searchable: true,
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
