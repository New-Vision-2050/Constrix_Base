import Company from "@/app/[locale]/(main)/companies/cells/company";
import DataStatus from "@/app/[locale]/(main)/companies/cells/data-status";
import Execution from "@/app/[locale]/(main)/companies/cells/execution";
import TheStatus from "@/app/[locale]/(main)/companies/cells/the-status";

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

export const companiesConfig = {
  url: "https://core-be-pr16.constrix-nv.com/api/v1/companies",
  columns: [
    {
      key: "name",
      label: "الشركات",
      sortable: true,
      render: (_: unknown, row: CompanyData) => <Company row={row} />,
    },
    {
      key: "email",
      label: "البريد الاليكتروني",
      sortable: true,
    },
    {
      key: "company_type",
      label: "نوع الشركة",
      sortable: true,
      searchable: true,
    },
    {
      key: "general_manager_name",
      label: "المسؤول",
      sortable: true,
    },
    {
      key: "complete_data",
      label: "حالة البيانات",
      sortable: true,
      render: (value: 0 | 1) => <DataStatus dataStatus={value} />,
    },
    {
      key: "is_active",
      label: "الحالة",
      render: (value: "active" | "inActive", row: CompanyData) => <TheStatus theStatus={value} id={row.id} />,
    },
    {
      key: "id",
      label: "الاجراء",
      render: (_: unknown, row: CompanyData) => <Execution id={row.id} />,
    },
  ],
  allSearchedFields: [
    {
      key: "country",
      searchType: {
        type: "dropdown",
        placeholder: "دولة الشركة",
        dynamicDropdown: {
          url: "https://jsonplaceholder.typicode.com/users",
          valueField: "id",
          labelField: "name",
          paginationEnabled: true,
          itemsPerPage: 5,
          searchParam: "q",
          pageParam: "page",
          limitParam: "per_page",
          totalCountHeader: "x-total-count",
        },
      },
    },
    {
      key: "companyType",
      searchType: {
        type: "dropdown",
        placeholder: "نوع الشركة",
        dynamicDropdown: {
          url: "https://jsonplaceholder.typicode.com/users",
          valueField: "address.city",
          labelField: "address.city",
          dependsOn: "country",
          filterParam: "country",
        },
      },
    },
    {
      key: "companyField",
      searchType: {
        type: "dropdown",
        placeholder: "نوع الشركة",
        dynamicDropdown: {
          url: "https://jsonplaceholder.typicode.com/users",
          valueField: "address.city",
          labelField: "address.city",
          dependsOn: "companyType",
          filterParam: "companyType",
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
  searchParamName: "q",
  searchFieldParamName: "fields",
  allowSearchFieldSelection: true,
};
