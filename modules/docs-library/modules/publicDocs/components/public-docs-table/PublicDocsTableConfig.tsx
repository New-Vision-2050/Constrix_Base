import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";

// Create a component that uses the translations
export const getPublicDocsTableConfig = () => {
  const t = useTranslations("docs-library.publicDocs.table")

  return {
    url: `${baseURL}/public-docs`,
    tableId: "public-docs-table",
    columns: [
      {
        key: "file_name",
        label: t("file_name"),
        sortable: true,
      },
      {
        key: "sorted_by",
        label: t("sorted_by"),
        sortable: true,
      },
      {
        key: "file_size",
        label: t("file_size"),
        sortable: true,
      },
      {
        key: "docs_count",
        label: t("docs_count"),
        sortable: true,
      },
      {
        key: "file_type",
        label: t("file_type"),
        sortable: true,
      },
      {
        key: "last_activity",
        label: t("last_activity"),
        sortable: true,
      },
      {
        key: "status",
        label: t("status"),
        sortable: true,
      },
      {
        key: "settings",
        label: t("settings"),
        sortable: true,
      }
    ],
    allSearchedFields: [],
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    enableExport: false,
    defaultItemsPerPage: 10,
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: ["name"],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    executions: [],
    executionConfig: {
      canEdit: false,
      canDelete: false,
    },
    deleteConfirmMessage: "",
  };
};
