import { baseURL } from "@/config/axios-config";
import { LoginIdentifier } from "@/modules/settings/types/LoginIdentifier";
import LoginIdentifierExecutionBtn from "./ExecutionBtn";
import TableStatus from "./TableStatus";
import { useTranslations } from "next-intl";

export const LoginIdentifierTableConfig = () => {
  const t = useTranslations();
  return {
    url: `${baseURL}/settings/identifier`,
    tableId: "login-identifier-table",
    columns: [
      {
        key: "name",
        label: t("LoginIdentifierTable.IdentifierName"),
        sortable: true,
        searchable: true,
      },
      {
        key: "users_count",
        label: "عدد المستخدين",
      },
      {
        key: "companies",
        label: "الشركات المستخدمة",
      },
      {
        key: "providers",
        label: "مزودين الخدمة",
      },
      {
        key: "status",
        label:  t("LoginIdentifierTable.Status"),
        render: (_: unknown, row: LoginIdentifier) => (
          <TableStatus
            url={`settings/identifier/make-default/${row.id}`}
            identifier={row}
          />
        ),
      },
      {
        key: "id",
        label: t("LoginIdentifierTable.Actions"),
        render: (_: unknown, row: LoginIdentifier) => (
          <LoginIdentifierExecutionBtn id={row.id} />
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
