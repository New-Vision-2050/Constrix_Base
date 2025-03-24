import { baseURL } from "@/config/axios-config";
import { Country } from "@/modules/settings/types/Country";
import TableStatus from "./TableStatus";

export const CountriesTableConfig = () => {
  return {
    url: `${baseURL}/countries`,
    tableId: "countries-table",
    columns: [
      {
        key: "name",
        label: "اسم الدولة",
        sortable: true,
        searchable: true,
      },
      {
        key: "sms_driver",
        label: "مزود الخدمة",
      },
      {
        key: "status",
        label: "الحالة",
        render: (_: unknown, row: Country) => (
          <TableStatus
            url={`change-country-status`}
            country={row}
          />
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
