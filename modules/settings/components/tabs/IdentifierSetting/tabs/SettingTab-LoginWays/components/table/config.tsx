import TableStatus from "./TableStatus";
import { baseURL } from "@/config/axios-config";
import { LoginWay } from "@/modules/settings/types/LoginWay";
import Execution from "@/app/[locale]/(main)/companies/cells/execution";
import { loginWayFormConfig } from "@/modules/settings/components/tabs/IdentifierSetting/tabs/SettingTab-LoginWays/components/form/config";
import { loginWayFormEditConfig } from "../form/editConfig";

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
      }
    ],
    allSearchedFields: [],
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    formConfig: loginWayFormEditConfig,
    executions: [],
    executionConfig: {
      canEdit: true,
      canDelete: true,
    },
    defaultItemsPerPage: 5,
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: ["name"],
    searchParamName: "q",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
  };
};
