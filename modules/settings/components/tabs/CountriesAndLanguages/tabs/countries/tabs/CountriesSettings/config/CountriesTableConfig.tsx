import { baseURL } from "@/config/axios-config";
import { Country } from "@/modules/settings/types/Country";
import CountriesSettingsActionsBtn from "../components/ActionsBtn";

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
      {
        key: "actions",
        label: "الأجراء",
        render: (_: unknown, row: Country) => (
          <CountriesSettingsActionsBtn id={row.id} />
        ),
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
