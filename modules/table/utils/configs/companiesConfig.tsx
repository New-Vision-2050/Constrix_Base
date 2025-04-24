import Company from "@/app/[locale]/(main)/companies/cells/company";
import DataStatus from "@/app/[locale]/(main)/companies/cells/data-status";
import TheStatus from "@/app/[locale]/(main)/companies/cells/the-status";
import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import EnterIcon from "@/public/icons/enter";
import GearIcon from "@/public/icons/gear";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { GetCompaniesFormConfig } from "@/modules/form-builder/configs/companiesFormConfig";

// Define types for the company data
interface CompanyData {
  id: string;
  name: string;
  user_name: string;
  email: string;
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
        key: "company_field",
        label: "النشاط",
        render: (value: any[] | null) => (
          <div className="line-clamp-3">
            {value &&
              value.map((field) => (
                <p key={field.id} className="line-clamp-1 h-5">
                  {field.name}
                </p>
              ))}
          </div>
        ),
      },
      {
        key: "general_manager.name",
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
            itemsPerPage: 10,
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
            itemsPerPage: 20,
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
    defaultItemsPerPage: 10,
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: ["name", "email"],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    formConfig: GetCompaniesFormConfig(),
    executions: [
      {
        label: t("Companies.LoginAsManager"),
        icon: <EnterIcon className="w-4 h-4" />,
        action: () => console.log("Login as manager clicked"),
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
    executionConfig: {
      canEdit: true,
      canDelete: true,
    },
  };
};
