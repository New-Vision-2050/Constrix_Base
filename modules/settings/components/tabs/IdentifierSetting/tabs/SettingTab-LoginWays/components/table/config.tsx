import { baseURL } from "@/config/axios-config";
import LoginWayStatus from "./LoginWayStatus";
import { LoginWay } from "@/modules/settings/types/LoginWay";
import LoginWaysExecutionBtn from "./ExecutionBtn";

// Create a component that uses the translations
export const LoginWaysConfig = () => {
  return {
    url: `${baseURL}/settings/login-way`,
    tableId: "login-ways-table", // Add tableId to the config
    columns: [
      {
        key: "name",
        label: "اسم الاعداد",
        sortable: true,
        searchable: true,
      },
      {
        key: "users_count",
        label: "عدد المستخدين",
        sortable: true,
      },
      {
        key: "companies",
        label: "الشركات المستخدمة",
      },
      {
        key: "providers",
        label: "مزودين الخدمة",
        sortable: true,
      },
      {
        key: "status",
        label: "الحالة",
        render: (_: unknown, row: LoginWay) => (
          <LoginWayStatus loginWay={row} />
        ),
      },
      {
        key: "id",
        label: "الأجراء",
        render: (_: unknown, row: LoginWay) => (
          <LoginWaysExecutionBtn id={row.id} />
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
