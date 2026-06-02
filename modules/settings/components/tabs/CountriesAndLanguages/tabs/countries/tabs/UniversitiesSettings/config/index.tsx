"use client";

import { baseURL } from "@/config/axios-config";
import { University } from "@/modules/settings/types/University";
import { universityFormEditConfig } from "../components/form/editConfig";
import Execution from "@/app/[locale]/(main)/companies/cells/execution";

export const UniversitiesTableConfig = () => {
  return {
    url: `${baseURL}/universities`,
    tableId: "universities-table",
    columns: [
      {
        key: "name",
        label: "أسم الجامعة",
        sortable: true,
        searchable: true,
      },
      {
        key: "country.name",
        label: "الدولة",
        sortable: true,
        render: (_: unknown, row: University) => row.country?.name ?? "-",
      },
      {
        key: "url",
        label: "الرابط",
        render: (value: string | null) => value ?? "-",
      },
      {
        key: "actions",
        label: "الإجراءات",
        render: (_: unknown, row: University) => (
          <Execution
            row={row}
            formConfig={universityFormEditConfig}
            tableName="universities-table"
            buttonLabel="الإجراءات"
            showEdit
            showDelete
          />
        ),
      },
    ],
    alwaysVisibleColumnKeys: ["name", "country.name", "url", "actions"],
    defaultVisibleColumnKeys: ["name", "country.name", "url", "actions"],
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
