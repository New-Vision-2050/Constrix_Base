import { baseURL } from "@/config/axios-config";

export const LanguagesSettingTableConfig = () => {
  return {
    url: `${baseURL}/languages`,
    tableId: "languages-table",
    columns: [
      {
        key: "name",
        label: "اللغة",
        sortable: true,
        searchable: true,
      },
      {
        key: "rtl",
        label: "نص من اليمين الى اليسار",
      },
      {
        key: "default",
        label: "افتراضي",
      },
      {
        key: "actions",
        label: "الأجراء",
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
