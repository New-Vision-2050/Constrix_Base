import { baseURL } from "@/config/axios-config";
import { Language } from "@/modules/settings/types/Language";
import LanguagesSettingsActionsBtn from "../components/ActionsBtn";

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
        key: "is_rtl",
        label: "نص من اليمين الى اليسار",
        render: (_: unknown, row: Language) => (
          <p>{row.is_rtl == 1 ? "نعم" : "لا"}</p>
        ),
      },
      {
        key: "status",
        label: "افتراضي",
        render: (_: unknown, row: Language) => (
          <p>{row.status == 1 ? "نعم" : "لا"}</p>
        ),
      },
      {
        key: "actions",
        label: "الأجراء",
        render: (_: unknown, row: Language) => (
          <LanguagesSettingsActionsBtn id={row.id} />
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
