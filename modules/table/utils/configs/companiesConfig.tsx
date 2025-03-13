import Company from "@/app/[locale]/(main)/companies/cells/company";
import DataStatus from "@/app/[locale]/(main)/companies/cells/data-status";
import Execution from "@/app/[locale]/(main)/companies/cells/execution";
import TheStatus from "@/app/[locale]/(main)/companies/cells/the-status";
import { useTranslations } from "next-intl";

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

// Export a default config for static imports
export const companiesConfig = {
  url: "https://core-be-pr16.constrix-nv.com/api/v1/companies",
  columns: [
    {
      key: "name",
      label: "Companies",
      sortable: true,
      render: (_: unknown, row: any) => <Company row={row} />,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "company_type",
      label: "Company Type",
      sortable: true,
      searchable: true,
    },
    {
      key: "general_manager_name",
      label: "Manager",
      sortable: true,
    },
    {
      key: "complete_data",
      label: "Data Status",
      sortable: true,
      render: (value: 0 | 1) => <DataStatus dataStatus={value} />,
    },
    {
      key: "is_active",
      label: "Status",
      render: (value: "active" | "inActive", row: any) => <TheStatus theStatus={value} id={row.id} />,
    },
    {
      key: "id",
      label: "Actions",
      render: (_: unknown, row: any) => <Execution id={row.id} />,
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
  searchFields: ["name", "email"],
  searchParamName: "q",
  searchFieldParamName: "fields",
  allowSearchFieldSelection: true,
};
