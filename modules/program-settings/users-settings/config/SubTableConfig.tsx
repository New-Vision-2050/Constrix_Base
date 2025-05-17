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
import SubTableStatus from "../components/sub-tables/SubTableStatus";
import { UpdateSubTableSettings } from "./UpdateSubTableSettings";

// Create a component that uses the translations
export const SubTableConfig = (slug: string) => {
  return {
    url: `${baseURL}/sub_entities/super_entity/sub_tables?super_entity_id=${slug}`,
    tableId: `program-settings-sub-table-${slug}`,
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
        render: (value: 0 | 1, row: Entity) => (
          <SubTableStatus theStatus={value} id={row.id} />
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
            url: `${baseURL}/sub_entities/list/selection`,
            valueField: "name",
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
        key: "main_program_slug",
        searchType: {
          type: "dropdown",
          placeholder: "البرنامج الرئيسي",
          dynamicDropdown: {
            url: `${baseURL}/programs`,
            valueField: "slug",
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
            config: UpdateSubTableAttributes(row?.id, row, slug),
          };
        },
      },
      {
        label: "اعدادات الجدول",
        action:"openSettingsTable", 
        dialogComponent: SheetFormBuilder,
        dialogProps: (row: Entity) => {
          return {
            config: UpdateSubTableSettings(row?.id, row, slug),
          };
        },
      },
    ],
  };
};
