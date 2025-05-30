import { baseURL } from "@/config/axios-config";

export const CountriesTableConfig = () => {
  return {
    url: `${baseURL}/countries`,
    tableId: "countries-table",
    columns: [
      {
        key: "language",
        label: "اللغة",
      },
      {
        key: "name",
        label: "الدولة",
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
