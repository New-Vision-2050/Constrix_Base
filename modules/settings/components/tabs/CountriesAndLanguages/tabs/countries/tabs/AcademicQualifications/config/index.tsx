"use client";

import { baseURL } from "@/config/axios-config";
import { academicQualificationFormEditConfig } from "../components/form/editConfig";
import Execution from "@/app/[locale]/(main)/companies/cells/execution";

export const AcademicQualificationsTableConfig = () => {
  return {
    url: `${baseURL}/academic_qualifications`,
    tableId: "academic-qualifications-table",
    columns: [
      {
        key: "name",
        label: "اسم المؤهل",
        sortable: true,
        searchable: true,
      },
      {
        key: "actions",
        label: "الإجراءات",
        render: (_: unknown, row: { id: string; name: string }) => (
          <Execution
            row={row}
            formConfig={academicQualificationFormEditConfig}
            tableName="academic-qualifications-table"
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
