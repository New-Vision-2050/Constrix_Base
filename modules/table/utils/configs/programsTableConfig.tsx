import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import React from "react";

import { ROUTER } from "@/router";
import { GetProgramFormConfig } from "@/modules/form-builder/configs/programFormConfig";
import { FieldConfig } from "@/modules/form-builder";
import TheStatus from "@/modules/programs/components/the-status";

export interface ProgramTableRow {
  id: string;
  name: string;
  programs_count: number;
  packages_count: number;
  company_fields_count: number;
  is_active: "active" | "inActive";
}

export const programsConfig = (t: ReturnType<typeof useTranslations>, router: any, dynamicFields: FieldConfig[]) => {

  return {
    url: `${baseURL}/company_access_programs`,
    tableId: "program-systems-table", // Add tableId to the config
    columns: [
      {
        key: "name",
        label: "اسم البرنامج",
        searchable: true,
        render: (_: unknown, row: ProgramTableRow) => (
          <div 
            className="flex gap-3 border-e-2 cursor-pointer"
            onClick={() => router.push(ROUTER.BouquetById(row.id))}
          >
            <div>
              <p className="font-medium">{row.name}</p>
            </div>
          </div>
        ),
      },
      {
        key: "programs_count",
        label: "عدد البرامج",
        render: (_: unknown, row: ProgramTableRow) => (
          <p className="font-medium">{row.programs_count}</p>
        ),
      },
      {
        key: "packages_count",
        label: "عدد الباقات",
        render: (_: unknown, row: ProgramTableRow) => (
          <p className="font-medium">{row.packages_count}</p>
        ),
      },
      {
        key: "company_fields_count",
        label: "المجالات المرتبطة",
        render: (_: unknown, row: ProgramTableRow) => (
          <p className="font-medium">{row.company_fields_count}</p>
        ),
      },
      {
        key: "status",
        label: "الحالة",
        render: (value: "active" | "inActive", row: ProgramTableRow) => (
          <TheStatus theStatus={value} id={row.id} />
        ),
      },
    ],
    allSearchedFields: [
      {
        key: "name",
        searchType: {
          type: "text",
          placeholder: "اسم البرنامج",
        },
      },
      {
        key: "company_field_id",
        searchType: {
          type: "dropdown",
          placeholder: "المجال",
          dynamicDropdown: {
            url: `${baseURL}/company_fields`,
            valueField: "id",
            isMulti: true,
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
       {
        key: "status",
        searchType: {
          type: "dropdown",
          placeholder: "الحالة",
          dropdownOptions: [
            { value: "1", label: "نشط" },
            { value: "0", label: "غير نشط" },
          ],
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
    searchFields: ["name", "company_field_id", "status"],
    searchParamName: "name",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    executions:[],
    formConfig: GetProgramFormConfig(t, dynamicFields),
    executionConfig: {
      canEdit: true,
      canDelete: true,
    },
  };
};
