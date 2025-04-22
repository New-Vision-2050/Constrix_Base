import { baseURL } from "@/config/axios-config";
import { Language } from "@/modules/settings/types/Language";
import LanguagesSettingsActionsBtn from "../components/ActionsBtn";
import { useTranslations } from "next-intl";

export const LanguagesSettingTableConfig = () => {
  const t = useTranslations("LanguagesTable");
  return {
    url: `${baseURL}/languages`,
    tableId: "languages-table",
    columns: [
      {
        key: "name",
        label: t("Language"),
        sortable: true,
        searchable: true,
      },
      {
        key: "is_rtl",
        label: t("TextFromRightToLeft"),
        render: (_: unknown, row: Language) => (
          <p>{row.is_rtl == 1 ? "نعم" : "لا"}</p>
        ),
      },
      {
        key: "status",
        label: t("Default"),
        render: (_: unknown, row: Language) => (
          <p>{row.status == 1 ? "نعم" : "لا"}</p>
        ),
      },
      {
        key: "actions",
        label:  t("Actions"),
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
