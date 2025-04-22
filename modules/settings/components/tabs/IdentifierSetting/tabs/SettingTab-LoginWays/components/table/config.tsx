import { baseURL } from "@/config/axios-config";
import { LoginWay } from "@/modules/settings/types/LoginWay";
import LoginWaysExecutionBtn from "./ExecutionBtn";
import TableStatus from "./TableStatus";
import Execution from "@/app/[locale]/(main)/companies/cells/execution";
import { useTranslations } from "next-intl";
import {
    loginWayFormConfig
} from "@/modules/settings/components/tabs/IdentifierSetting/tabs/SettingTab-LoginWays/components/form/config";

// Create a component that uses the translations
export const LoginWaysConfig = () => {
  const t = useTranslations("LoginWaysTable");
  return {
    url: `${baseURL}/settings/login-way`,
    tableId: "login-ways-table",
    columns: [
      {
        key: "name",
        label: t("SettingName"),
        sortable: true,
        searchable: true,
      },
      {
        key: "users_count",
        label: t("UsersCount"),
        sortable: true,
      },
      {
        key: "companies",
        label: "الشركات المستخدمة",
      },
      {
        key: "providers",
        label: t("ServiceProviders"),
        sortable: true,
      },
      {
        key: "status",
        label: t("Status"),
        render: (value: "active" | "inActive", row: LoginWay) => (
          <TableStatus
            loginWay={row}
            url={`/settings/login-way/make-default/${row.id}`}
          />
        ),
      },
      {
        key: "id",
        label: t("Actions"),
        render: (_: unknown, row: LoginWay) => (
          <Execution id={row.id}  formConfig={loginWayFormConfig}/>
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
