"use client";

import { baseURL } from "@/config/axios-config";
import { academicSpecializationFormEditConfig } from "../components/form/editConfig";
import Execution from "@/app/[locale]/(main)/companies/cells/execution";

export const AcademicSpecializationsTableConfig = () => {
  return {
    url: `${baseURL}/academic_specializations`,
    tableId: "academic-specializations-table",
    columns: [
      {
        key: "name",
        label: "اسم التخصص",
        sortable: true,
        searchable: true,
      },
      {
        key: "actions",
        label: "الإجراءات",
        render: (_: unknown, row: { id: string; name: string }) => (
          <Execution
            row={row}
            formConfig={academicSpecializationFormEditConfig}
            tableName="academic-specializations-table"
            buttonLabel="الإجراءات"
            showEdit
            showDelete
          />
        ),
      },
    ],
    alwaysVisibleColumnKeys: ["name", "actions"],
    defaultVisibleColumnKeys: ["name", "actions"],
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
