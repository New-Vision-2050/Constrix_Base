import DataStatus from "@/app/[locale]/(main)/companies/cells/data-status";
import { AvatarGroup } from "@/components/shared/avatar-group";
import { baseURL } from "@/config/axios-config";
import { cn } from "@/lib/utils";
import { rulesIcons } from "@/modules/users/constants/rules-icons";
import { useTranslations } from "next-intl";
import React from "react";
import GearIcon from "@/public/icons/gear";
import { GetCompanyUserFormConfig } from "@/modules/form-builder/configs/companyUserFormConfig";
import ChooseUserCompany from "@/modules/users/components/choose-company-dialog";
import TheStatus from "@/app/[locale]/(main)/companies/cells/the-status";

// Define types for the company data
interface CompanyData {
  id: string;
  name: string;
  phone: string;
  logo: string;
  roles: Array<{
    role: 1 | 2 | 3; // Keys in rulesIcons
    status: number;
  }>;
  users: { id: string }[];
}

export interface UserTableRow {
  id: string;
  logo: string;
  name: string;
  user_name: string;
  email: string;
  company_type: string;
  general_manager_name: string;
  complete_data: 0 | 1; // 0 = pending, 1 = success
  is_active: "active" | "inActive";
  companies: CompanyData[];
  user_id: string;
  [key: string]: any; // For any other properties
}

// Create a component that uses the translations
export const programsConfig = () => {
  const t = useTranslations("Companies");

  return {
    url: `${baseURL}/company-users`,
    tableId: "users-table", // Add tableId to the config
    columns: [
      {
        key: "name",
        label: "اسم البرنامج",
        // sortable: true,
        searchable: true,
        render: (_: unknown, row: UserTableRow) => (
          <div className="flex gap-3 border-e-2">
            <div>
              <p className="font-medium">{row.name}</p>
            </div>
          </div>
        ),
      },
      {
        key: "email",
        label: "عدد البرامج",
        // sortable: true,
        render: (_: unknown, row: UserTableRow) => (
          <p className="font-medium">1</p>
        ),
      },
      {
        key: "email",
        label: "عدد الباقات",
        // sortable: true,
        render: (_: unknown, row: UserTableRow) => (
          <p className="font-medium">1,000 ر.س</p>
        ),
      },
      {
        key: "email",
        label: "المجالات المرتبطة",
        // sortable: true,
        render: (_: unknown, row: UserTableRow) => (
          <p className="font-medium">سنوية</p>
        ),
      },
      {
        key: "is_active",
        label: "الحالة",
        render: (value: "active" | "inActive", row: UserTableRow) => (
          <TheStatus theStatus={value} id={row.id} />
        ),
      },
    ],
    allSearchedFields: [
      {
        key: "email_or_phone",
        searchType: {
          type: "text",
          placeholder: "اسم البرنامج",
        },
      },
      {
        key: "company_id",
        searchType: {
          type: "dropdown",
          placeholder: "المجال",
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
        key: "company_id",
        searchType: {
          type: "dropdown",
          placeholder: "الحالة",
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
    // deleteUrl: `${baseURL}/company-users`,
    formConfig: GetCompanyUserFormConfig(t),
    executionConfig: {
      canEdit: true,
      canDelete: true,
    },
  };
};
