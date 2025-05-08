import { baseURL } from "@/config/axios-config";
import { useTranslations } from "next-intl";
import React from "react";
import { GetCompanyUserFormConfig } from "@/modules/form-builder/configs/companyUserFormConfig";
import ChooseUserCompany from "@/modules/users/components/choose-company-dialog";
import TheStatus from "@/app/[locale]/(main)/companies/cells/the-status";


interface Entity {
  id: string;
  name: string;
  icon: number;
  super_entity: string;
  is_active: number;
  is_registrable: number;
  main_program: string;
  main_program_id: string;
  default_attributes: string[];
  optional_attributes: string[];
  created_at: string;
  updated_at: string;
}
// Create a component that uses the translations
export const SubTableConfig = () => {
  const t = useTranslations();

  return {
    url: `${baseURL}/sub_entities/programs/sub_tables?program_name=users`,
    tableId: "program-settings-sub-table", // Add tableId to the config
    columns: [
      {
        key: "name",
        label: "اسم الجدول",
        sortable: true,
        searchable: true,
      },
      {
        key: "super_entity",
        label: "الجدول الرئيسي",
        sortable: true,
      },
      {
        key: "main_program",
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
        key: "dummy-2",
        label: "عدد عناصر التصفية",
        sortable: true,
        render: () => <div>5</div>,
      },
      {
        key: "dummy-3",
        label: "عدد مستخدمين الجدول",
        sortable: true,
        render: () => <div>13</div>,
      },
      {
        key: "dummy-4",
        label: "عدد مستخدمين الجدول",
        sortable: true,
        render: () => <div>13</div>,
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
        key: "company_id",
        searchType: {
          type: "dropdown",
          placeholder: "اسم الجدول",
          dynamicDropdown: {
            url: `${baseURL}/companies`,
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
        key: "company_id2",
        searchType: {
          type: "dropdown",
          placeholder: "نموذج التسجيل",
          dynamicDropdown: {
            url: `${baseURL}/companies`,
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
        key: "company_id3",
        searchType: {
          type: "dropdown",
          placeholder: "البرنامج الرئيسي",
          dynamicDropdown: {
            url: `${baseURL}/companies`,
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
    searchFields: ["name", "email"],
    searchParamName: "q",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    formConfig: GetCompanyUserFormConfig,
    executions: [
      {
        label: "محتويات الجدول",
        action: "openDialog",
        dialogComponent: ChooseUserCompany,
        dialogProps: (row: Entity) => {
          return {
            user: row,
          };
        },
      },
      {
        label: "اعدادات الجدول",
        action: "openDialog",
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
