import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";

export const UserProjectsTableConfig = () => {
  const t = useTranslations();
  return {
    url: `${baseURL}/user-projects`,
    tableId: "user-projects-table",
    columns: [
      {
        key: "name",
        label: t("UserProjectsTable.Project"),
        sortable: true,
        searchable: true,
      },
      {
        key: "name",
        label: t("UserProjectsTable.Number of Tasks"),
      },
      {
        key: "name",
        label: t("UserProjectsTable.Completion Rate"),
      },
      {
        key: "name",
        label: t("UserProjectsTable.Hours"),
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
