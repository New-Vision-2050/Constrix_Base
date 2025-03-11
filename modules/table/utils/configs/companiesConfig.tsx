import Company from "@/app/[locale]/(main)/companies/cells/company";
import DataStatus from "@/app/[locale]/(main)/companies/cells/data-status";
import Execution from "@/app/[locale]/(main)/companies/cells/execution";
import TheStatus from "@/app/[locale]/(main)/companies/cells/the-status";

export const companiesConfig = {
  url: "https://core-be-pr16.constrix-nv.com/api/v1/companies",
  columns: [
    {
      key: "name",
      label: "الشركات",
      sortable: true,
      searchable: true,
      render: (_, row) => <Company row={row} />,
    },
    {
      key: "email",
      label: "البريد الاليكتروني",
      sortable: true,
      searchable: true,
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
      searchable: true,
    },
    {
      key: "complete_data",
      label: "حالة البيانات",
      sortable: true,
      searchable: true,
      render: (value) => <DataStatus dataStatus={value} />,
    },
    {
      key: "is_active",
      label: "الحالة",
      render: (value, row) => <TheStatus theStatus={value} id={row.id} />,
      
    },
    {
      key: "id",
      label: "الاجراء",
      render: (_, row) => <Execution id={row.id} />,
    },
  ],
  defaultSortColumn: "id",
  defaultSortDirection: "asc",
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
