import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import React from "react";
import { GetCompanyUserFormConfig } from "@/modules/form-builder/configs/companyUserFormConfig";
import ChooseUserCompany from "@/modules/users/components/choose-company-dialog";
import TheStatus from "@/app/[locale]/(main)/companies/cells/the-status";
import EmployeeTableContent from "../components/sub-tables/EmployeeTableContent";
import { SheetFormBuilder } from "@/modules/form-builder";
import { AddDocFormConfig } from "@/modules/company-profile/components/official-data/official-docs-section/add-doc-form-config";
import { UpdateSubTableAttributes } from "./UpdateSubTableAttributes";
import { Entity } from "../types/entity";

// Create a component that uses the translations
export const SubTableConfig = (programSlug: string) => {
  return {
    url: `${baseURL}/sub_entities/programs/sub_tables?program_id=f872bcc1-8734-4ada-9b6a-dcaf7ad34564`,
    tableId: "program-settings-sub-table", // Add tableId to the config
    columns: [
      {
        key: "name",
        label: "اسم الجدول",
        sortable: true,
        searchable: true,
      },
      {
        key: "super_entity.name",
        label: "الجدول الرئيسي",
        sortable: true,
      },
      {
        key: "main_program.name",
        label: "البرنامج الرئيسي",
        sortable: true,
      },
      {
        key: "dummy-1",
        label: "نموذج التسجيل",
        sortable: true,
        render: () => <div>نموذج 1</div>,
      },
      {
        key: "attributes_count",
        label: "عدد عناصر التصفية",
        sortable: true,
      },
      {
        key: "usage_count",
        label: "عدد مستخدمين الجدول",
        sortable: true,
      },
      {
        key: "is_active",
        label: "الحالة",
        render: (value: "active" | "inActive", row: Entity) => (
          <TheStatus theStatus={value} id={row.id} />
        ),
      },
    ],
    allSearchedFields: [
      {
        key: "entity_name",
        searchType: {
          type: "dropdown",
          placeholder: "اسم الجدول",
          dynamicDropdown: {
            url: `${baseURL}/programs?program_name=users`,
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
        key: "registered_form",
        searchType: {
          type: "dropdown",
          placeholder: "نموذج التسجيل",
          dropdownOptions: [{ value: "form 1", label: "نموذج 1" }],
        },
      },
      {
        key: "super_entity",
        searchType: {
          type: "dropdown",
          placeholder: "البرنامج الرئيسي",
          dynamicDropdown: {
            url: `${baseURL}/programs?program_name=users`,
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
    searchFields: ["name"],
    searchParamName: "name",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    formConfig: GetCompanyUserFormConfig,
    executions: [
      {
        label: "محتويات الجدول",
        action: "openEmployeeTableContentDialog",
        dialogComponent: SheetFormBuilder,
        dialogProps: (row: Entity) => {
          return {
            config: UpdateSubTableAttributes(row?.id, row),
          };
        },
      },
      {
        label: "اعدادات الجدول",
        action: () => null,
        dialogComponent: ChooseUserCompany,
        dialogProps: (row: Entity) => {
          return {
            user: row,
          };
        },
      },
    ],
  };
};
