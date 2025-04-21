import Company from "@/app/[locale]/(main)/companies/cells/company";
import DataStatus from "@/app/[locale]/(main)/companies/cells/data-status";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { companiesFormConfig } from "@/modules/form-builder";
import { customerRelationFormConfig } from "@/modules/form-builder/configs/customerRelationFormConfig";
import Execution from "@/modules/customer-relations/components/execution";
import TheStatus from "@/modules/customer-relations/components/the-status";
import { Checkbox } from "@/components/ui/checkbox";
import ClientName from "@/modules/customer-relations/components/clientName";

// Define types for the company data
interface CompanyData {
  id: string;
  name: string;
  user_name: string;
  email: string;
  company_type: string;
  general_manager_name: string;
  complete_data: 0 | 1; // 0 = pending, 1 = success
  is_active: "active" | "inActive";
  [key: string]: any; // For any other properties
}

// Create a component that uses the translations
export const BrokersConfig = () => {
  const t = useTranslations("");

  return {
    url: `${baseURL}/companies`,
    tableId: "broker-table", // Add tableId to the config
    columns: [
      {
        key: "id",
        label: <Checkbox />,
        // sortable: true,
        render: () => <Checkbox />,
      },
      {
        key: "name",
        label: t("Broker.BrokerName"),
        // sortable: true,
        render: (_: unknown, row: CompanyData) => <ClientName row={row} />,
      },
      {
        key: "complete_data",
        label: t("CustomerRelation.Branch"),
        // sortable: true,
      },
      {
        key: "email",
        label: t("CustomerRelation.Email"),
        // sortable: true,
        searchable: true,
      },
      {
        key: "complete_data",
        label: t("CustomerRelation.PhoneNumber"),
        // sortable: true,
      },

      {
        key: "complete_data",
        label: t("CustomerRelation.ClientStatus"),
        render: (value: "active" | "inActive", row: CompanyData) => (
          <TheStatus theStatus={value} id={row.id} />
        ),
      },
      {
        key: "id",
        label: t("CustomerRelation.Settings"),
        render: (_: unknown, row: CompanyData) => (
          <Execution id={row.id} formConfig={customerRelationFormConfig} />
        ),
      },
    ],
    allSearchedFields: [
      {
        key: "company_type_id",
        searchType: {
          type: "dropdown",
          placeholder: t("CustomerRelation.Branch"),
          dynamicDropdown: {
            url: `${baseURL}/company_types`,
            valueField: "id",
            labelField: "name",
            paginationEnabled: true,
            itemsPerPage: 5,
            searchParam: "name",
            pageParam: "page",
            limitParam: "per_page",
            totalCountHeader: "x-total-count",
          },
        },
      },
      {
        key: "company_field_id",
        searchType: {
          type: "dropdown",
          placeholder: t("CustomerRelation.ClientStatus"),
          dynamicDropdown: {
            url: `${baseURL}/company_fields`,
            valueField: "id",
            labelField: "name",
            paginationEnabled: true,
            itemsPerPage: 5,
            searchParam: "name",
            pageParam: "page",
            limitParam: "per_page",
            totalCountHeader: "x-total-count",
          },
        },
      },
    ],
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    defaultItemsPerPage: 5,
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: ["name", "email"],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
  };
};
