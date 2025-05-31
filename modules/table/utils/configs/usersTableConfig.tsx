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
export const UsersConfig = () => {
  const t = useTranslations();

  return {
    url: `${baseURL}/company-users`,
    tableId: "users-table", // Add tableId to the config
    columns: [
      {
        key: "name",
        label: "الاسم",
        sortable: true,
        searchable: true,
        render: (_: unknown, row: UserTableRow) => (
          <div className="flex items-center gap-2">
            <AvatarGroup fullName={row.name} alt={row.name} /> {row.name}
          </div>
        ),
      },
      {
        key: "email",
        label: t("Companies.Email"),
        sortable: true,
      },
      {
        key: "phone",
        label: "رقم الجوال",
        render: (_: unknown, row: UserTableRow) => {
          const companies = row.companies || [];
          return (
            <div className="line-clamp-3">
              {companies.map((company) => (
                <p key={company.id} className="line-clamp-1 h-5" dir={"ltr"} style={{width: "fit-content"}}>
                  {company?.phone || ""}
                </p>
              ))}
            </div>
          );
        },
      },
      {
        key: "companies",
        label: "الشركة",
        render: (value: any[] | null) => (
          <div className="line-clamp-3">
            {value &&
              value.map((company) => (
                <p key={company.id} className="line-clamp-1 h-5">
                  {company.name}
                </p>
              ))}
          </div>
        ),
      },
      {
        key: "user-type",
        label: "نوع المستخدم",
        render: (_: unknown, row: UserTableRow) => {
          const companies = row.companies || [];
          return (
            <div className="line-clamp-3 ">
              {companies.map((company) => (
                <div key={company.id} className="flex items-center gap-x-1">
                  {Array.from({ length: 3 }).map((_, index) => {
                    // Find role matching index + 1
                    const role =
                      company.roles.find((r) => Number(r.role) === index + 1) ||
                      null;
                    return role ? (
                      <span
                        key={index}
                        className={cn(
                          "w-5 h-5 flex items-center justify-center",
                          role.status === 1 && "text-[#18CB5F]",
                          role.status === 0 && "text-[#FF4747]",
                          role.status === -1 && "text-[#F19B02]"
                        )}
                      >
                        {React.createElement(
                          rulesIcons[(index + 1) as keyof typeof rulesIcons]
                        )}
                      </span>
                    ) : (
                      <span key={index} className="w-5 h-5 flex items-center" />
                    );
                  })}
                </div>
              ))}
            </div>
          );
        },
      },
      {
        key: "data_status",
        label: t("Companies.DataStatus"),
        sortable: true,
        render: (value: 0 | 1) => <DataStatus dataStatus={value} />,
      },
    ],
    allSearchedFields: [
      {
        key: "company_id",
        searchType: {
          type: "dropdown",
          placeholder: "الشركة",
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
      // {
      //   key: "companyType",
      //   searchType: {
      //     type: "dropdown",
      //     placeholder: "حالة المستخدم",
      //     dropdownOptions: [
      //       { value: "active", label: "نشط" },
      //       { value: "inactive", label: "غير نشط" },
      //     ],
      //   },
      // },
      {
        key: "email_or_phone",
        searchType: {
          type: "text",
          placeholder: "البريد الإليكتروني / الجوال",
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
        label: "اكمال الملف الشخصي",
        icon: <GearIcon className="w-4 h-4" />,
        action: "openDialog",
        dialogComponent: ChooseUserCompany, // Your custom dialog component
        dialogProps: (row: UserTableRow) => {
          return {
            user: row,
          };
        },
      },
    ],
    executionConfig: {
      canEdit: false,
      canDelete: true,
    },
  };
};
