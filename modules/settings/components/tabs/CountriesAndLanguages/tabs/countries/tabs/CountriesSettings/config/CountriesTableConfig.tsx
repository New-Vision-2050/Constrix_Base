import { baseURL } from "@/config/axios-config";
import { Country } from "@/modules/settings/types/Country";
import CountriesSettingsActionsBtn from "../components/ActionsBtn";
import { useTranslations } from "next-intl";

export const CountriesTableConfig = () => {
  const t = useTranslations();
  return {
    url: `${baseURL}/countries`,
    tableId: "countries-table",
    columns: [
      {
        key: "language",
        label: t("CountriesTable.Language"),
      },
      {
        key: "name",
        label: t("CountriesTable.Country"),
        sortable: true,
        searchable: true,
      },
      {
        key: "actions",
        label: t("CountriesTable.Actions"),
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
