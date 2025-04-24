import { baseURL } from "@/config/axios-config";
import { LoginWay } from "@/modules/settings/types/LoginWay";
import LoginWaysExecutionBtn from "./ExecutionBtn";
import TableStatus from "./TableStatus";
import Execution from "@/app/[locale]/(main)/companies/cells/execution";
import {
    loginWayFormConfig
} from "@/modules/settings/components/tabs/IdentifierSetting/tabs/SettingTab-LoginWays/components/form/config";

// Create a component that uses the translations
export const LoginWaysConfig = () => {
  return {
    url: `${baseURL}/settings/login-way`,
    tableId: "login-ways-table",
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
        render: (value: "active" | "inActive", row: LoginWay) => (
          <TableStatus
            loginWay={row}
            url={`/settings/login-way/make-default/${row.id}`}
          />
        ),
      },
      {
        key: "id",
        label: "الأجراء",
        render: (_: unknown, row: LoginWay) => (
          <Execution row={row}  formConfig={loginWayFormConfig}/>
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
