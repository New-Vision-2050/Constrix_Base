import Company from "@/app/[locale]/(main)/companies/cells/company";
import DataStatus from "@/app/[locale]/(main)/companies/cells/data-status";
import Execution from "@/app/[locale]/(main)/companies/cells/execution";
import TheStatus from "@/app/[locale]/(main)/companies/cells/the-status";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import { companiesFormConfig } from "@/modules/form-builder";
import EnterIcon from "@/public/icons/enter";
import GearIcon from "@/public/icons/gear";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";

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
export const CompaniesConfig = () => {
  const t = useTranslations();

  return {
    url: `${baseURL}/companies`,
    tableId: "companies-table", // Add tableId to the config
    columns: [
      {
        key: "name",
        label: t("Companies.Companies"),
        sortable: true,
        render: (_: unknown, row: CompanyData) => <Company row={row} />,
      },
      {
        key: "email",
        label: t("Companies.Email"),
        sortable: true,
      },
      {
        key: "company_type",
        label: t("Companies.CompanyType"),
        sortable: true,
        searchable: true,
      },
      {
        key: "general_manager_name",
        label: t("Companies.Manager"),
        sortable: true,
      },
      {
        key: "complete_data",
        label: t("Companies.DataStatus"),
        sortable: true,
        render: (value: 0 | 1) => <DataStatus dataStatus={value} />,
      },
      {
        key: "is_active",
        label: t("Companies.Status"),
        render: (value: "active" | "inActive", row: CompanyData) => (
          <TheStatus theStatus={value} id={row.id} />
        ),
      },
    ],
    allSearchedFields: [
      {
        key: "country_id",
        searchType: {
          type: "dropdown",
          placeholder: t("Companies.CountryFilter"),
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
          placeholder: t("Companies.TypeFilter"),
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
          placeholder: t("Companies.CompanySection"),
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
    formConfig: companiesFormConfig,
    executions: [
      {
        label: t("Companies.LoginAsManager"),
        icon: <EnterIcon className="w-4 h-4" />,
        action: () => console.log("Login as manager clicked"),
        position: "after",
      },
      {
        label: t("Companies.PackageSettings"),
        icon: <GearIcon className="w-4 h-4" />,
        action: "packageSettings",
        dialogComponent: DeleteConfirmationDialog,
        dialogProps: {
          title: "Package Settings",
          shouldReloadTable: true,
        },
      },
    ],
  };
};
