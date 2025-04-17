import Company from "@/app/[locale]/(main)/companies/cells/company";
import DataStatus from "@/app/[locale]/(main)/companies/cells/data-status";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { companiesFormConfig } from "@/modules/form-builder";
import { customerRelationFormConfig } from "@/modules/form-builder/configs/customerRelationFormConfig";
import Execution from "@/modules/customer-relations/components/execution";
import TheStatus from "@/modules/customer-relations/components/the-status";
import { Checkbox } from "@/components/ui/checkbox";

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
export const CustomerRelationConfig = () => {
  const t = useTranslations("CustomerRelation");

  return {
    url: `${baseURL}/companies`,
    tableId: "customer-relation-table", // Add tableId to the config
    columns: [
      {
        key: "name",
        label: <Checkbox />,
        // sortable: true,
        render: () => <Checkbox />,
      },
      {
        key: "name",
        label: t("ClientName"),
        // sortable: true,
        // render: () => <>test</>,
      },
      {
        key: "complete_data",
        label: t("IDNumber"),
        // sortable: true,
      },
      {
        key: "email",
        label: t("Email"),
        // sortable: true,
        searchable: true,
      },
      {
        key: "complete_data",
        label: t("PhoneNumber"),
        // sortable: true,
      },
      {
        key: "complete_data",
        label: t("Branch"),
        // sortable: true,
        // render: (value: 0 | 1) => <DataStatus dataStatus={value} />
      },

      {
        key: "complete_data",
        label: t("Broker"),
        // render: (_: unknown, row: CompanyData) => <Execution id={row.id} formConfig={companiesFormConfig} />,
      },
      {
        key: "complete_data",
        label: t("ProjectCount"),
        // render: (_: unknown, row: CompanyData) => <Execution id={row.id} formConfig={companiesFormConfig} />,
      },
      {
        key: "complete_data",
        label: t("ClientStatus"),
        render: (value: "active" | "inActive", row: CompanyData) => (
          <TheStatus theStatus={value} id={row.id} />
        ),
      },
      {
        key: "id",
        label: t("Settings"),
        render: (_: unknown, row: CompanyData) => (
          <Execution id={row.id} formConfig={customerRelationFormConfig} />
        ),
      },
    ],
    allSearchedFields: [
      {
        key: "country_id",
        searchType: {
          type: "dropdown",
          placeholder: t("ClientType"),
          dynamicDropdown: {
            url: `${baseURL}/countries`,
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
        key: "company_type_id",
        searchType: {
          type: "dropdown",
          placeholder: t("Branch"),
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
          placeholder: t("Broker"),
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
