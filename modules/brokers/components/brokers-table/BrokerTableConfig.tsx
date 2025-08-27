import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Broker } from "../../types/Broker";
import { Branch } from "@/modules/company-profile/types/company";
import BrokerTableStatus from "./BrokerTableStatus";
import { getCreateIndividualBrokerFormConfig } from "../create-broker/individual/CreateIndividualBrokerFormConfig";

// Create a component that uses the translations
export const getBrokerTableConfig = () => {
  const { can } = usePermissions();
  const t = useTranslations("BrokersModule.table");
  const tForm = useTranslations("BrokersModule");

  return {
    url: `${baseURL}/company-users/brokers`,
    tableId: "brokers-table",
    columns: [
      {
        key: "name",
        label: t("columns.name"),
        sortable: true,
        render: (_: unknown, row: Broker) => (
          <div className="flex items-center gap-2 flex-wrap">
            {row.name}
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 whitespace-nowrap"
            >
              {row.type == 2 ? "ممثل لجهة" : "فرد"}
            </span>
          </div>
        ),
      },
      {
        key: "residence",
        label: t("columns.identity"),
        sortable: true,
      },
      {
        key: "email",
        label: t("columns.email"),
        sortable: true,
      },
      {
        key: "phone",
        label: t("columns.phone"),
        sortable: true,
      },
      {
        key: "branches",
        label: t("columns.branches"),
        render: (_: unknown, row: Broker) => (
          <div className="flex items-center gap-2 flex-wrap">
            {row?.branches?.map((branch: Branch) => (
              <span
                key={branch.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 whitespace-nowrap"
              >
                {branch.name}
              </span>
            ))}
            {row?.branches?.length === 0 && "_"}
          </div>
        ),
      },
      {
        key: "clientsNumber",
        label: t("columns.clientsNumber"),
        sortable: true,
      },
      {
        key: "status",
        label: t("columns.status"),
        render: (_: unknown, row: Broker) => <BrokerTableStatus broker={row} />,
      },
    ],
    allSearchedFields: [
      {
        key: "branch_id",
        searchType: {
          type: "dropdown",
          placeholder: t("filters.branchesFilter"),
          dynamicDropdown: {
            url: `${baseURL}/management_hierarchies/list?type=branch`,
            valueField: "id",
            labelField: "name",
            paginationEnabled: true,
            itemsPerPage: 10,
            searchParam: "name",
            pageParam: "page",
            limitParam: "per_page",
            totalCountHeader: "x-total-count",
          },
        },
      }
    ],
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    enableExport: can(PERMISSIONS.clients.clientsPage.export),
    defaultItemsPerPage: 10,
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: ["name"],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    formConfig: getCreateIndividualBrokerFormConfig(tForm, () => {}),
    executions: [],
    executionConfig: {
      canEdit: can(PERMISSIONS.clients.clientsPage.update),
      canDelete: can(PERMISSIONS.clients.clientsPage.delete),
    },
    deleteConfirmMessage: t("DeleteConfirmMessage"), // Custom delete confirmation message
  };
};
