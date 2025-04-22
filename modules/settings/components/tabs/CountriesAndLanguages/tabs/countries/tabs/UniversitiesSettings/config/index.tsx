import { baseURL } from "@/config/axios-config";
import CountriesSettingsActionsBtn from "../components/ActionsBtn";
import { University } from "@/modules/settings/types/University";

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
      {
        key: "actions",
        label: "الأجراء",
        render: (_: unknown, row: University) => (
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
