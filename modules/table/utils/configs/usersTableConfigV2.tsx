import DataStatus from "@/app/[locale]/(main)/companies/cells/data-status";
import { AvatarGroup } from "@/components/shared/avatar-group";
import { baseURL } from "@/config/axios-config";
import { cn } from "@/lib/utils";
import { rulesIcons } from "@/modules/users/constants/rules-icons";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import GearIcon from "@/public/icons/gear";
import { GetCompanyUserFormConfig } from "@/modules/form-builder/configs/companyUserFormConfig";
import ChooseUserCompany from "@/modules/users/components/choose-company-dialog";
import UserSettingDialog from "@/modules/users/components/UserSettingDialog";
import { Trash2 } from "lucide-react";
import DeleteSpecificRowDialog from "@/modules/users/components/DeleteSpecificRow";
import { ModelsTypes } from "@/modules/users/components/users-sub-entity-form/constants/ModelsTypes";
import { customerFormConfig } from "@/modules/form-builder/configs/customerFormConfig";
import { brokerFormConfig } from "@/modules/form-builder/configs/brokerFormConfig";
import { employeeFormConfig } from "@/modules/form-builder/configs/employeeFormConfig";
import { editIndividualClientFormConfig } from "@/modules/form-builder/configs/editIndividualClientFormConfig";
import { editIndividualBrokerFormConfig } from "@/modules/form-builder/configs/editIndividualBrokerFormConfig";

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
export const UsersConfigV2 = (options?: {
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  registrationFormSlug?: string;
}) => {
  const t = useTranslations("Companies");
  // define final form config for EDIT mode
  // Note: This config is used when clicking "Edit" button in the table
  const finalFormConfig = useMemo(() => {
    const registrationFromConfig = options?.registrationFormSlug;
    // client model - use simplified edit form
    if (registrationFromConfig === ModelsTypes.CLIENT) {
      return editIndividualClientFormConfig(t);
    }
    // broker model - use simplified edit form
    if (registrationFromConfig === ModelsTypes.BROKER) {
      return editIndividualBrokerFormConfig(t);
    }
    // employee model - use full form (no simplified version yet)
    if (registrationFromConfig === ModelsTypes.EMPLOYEE) {
      return employeeFormConfig(t);
    }
    // default fallback (company user form)
    return GetCompanyUserFormConfig(t);
  },[options?.registrationFormSlug, t]);

  return {
    url: `${baseURL}/company-users`,
    tableId: "users-table-v2", // Add tableId to the config
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
        key: "job_title",
        label: "المسمى الوظيفي",
      },
      {
        key: "residence",
        label: "رقم الهوية",
      },
      {
        key: "email",
        label: t("Email"),
        sortable: true,
      },
      {
        key: "phone",
        label: "رقم الجوال",
        render: (_: unknown, row: UserTableRow) => {
          const companies = row.companies || [];
          return (
            <div className="line-clamp-3 flex flex-col items-start justify-start">
              {companies.map((company) => (
                <p
                  key={company.id}
                  className="line-clamp-1 h-5"
                  dir={"ltr"}
                  style={{ width: "fit-content" }}
                >
                  {company?.phone || ""}
                </p>
              ))}
            </div>
          );
        },
      },
      {
        key: "branch",
        label: "الفرع",
        sortable: true,
      },
      {
        key: "broker",
        label: "الوسيط",
      },
      {
        key: "number-of-projects",
        label: "عدد المشاريع",
        sortable: true,
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
        key: "end_date",
        label: "تاريخ نهاية العقد",
        sortable: true,
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
        label: t("DataStatus"),
        sortable: true,
        render: (value: 0 | 1) => <DataStatus dataStatus={value} />,
      },
    ],
    allSearchedFields: [
      {
        key: "company_id",
        name: "companies",
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
        name: "email_or_phone",
        searchType: {
          type: "text",
          placeholder: "البريد الإليكتروني / الجوال",
        },
      },
    ],
    availableColumnKeys: [
      "name",
      "email",
      "phone",
      "companies",
      "user-type",
      "data_status",
      "branch",
      "job_title",
      "residence",
      "broker",
      "number_of_projects",
      "end_date",
    ],
    defaultVisibleColumnKeys: [
      "name",
      "email",
      "phone",
      "companies",
      "user-type",
      "data_status",
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
    formConfig: finalFormConfig,
    executions: [
      ...(options?.registrationFormSlug === ModelsTypes.EMPLOYEE ?
        [{
          id: "complete-profile",
          label: "اكمال الملف الشخصي",
          icon: <GearIcon className="w-4 h-4" />,
          action: "complete-profile",
          dialogComponent: ChooseUserCompany,
          disabled: options?.canEdit,
          dialogProps: (row: UserTableRow) => {
            return {
              user: row
            };
          },
        },
        {
          id: "user-settings",
          label: "اعدادات الموظف",
          icon: <GearIcon className="w-4 h-4" />,
          action: "user-settings",
          dialogComponent: UserSettingDialog,
          disabled: options?.canView,
          dialogProps: (row: UserTableRow) => {
            return {
              user: row,
            };
          },
        }]
        : []),
      {
        id: "delete-user",
        label: "حذف",
        action: "delete-user",
        icon: <Trash2 className="w-4 h-4 text-red-500" />,
        dialogComponent: DeleteSpecificRowDialog,
        disabled: Boolean(options?.canDelete),
        dialogProps: (row: UserTableRow) => {
          return {
            user: row,
            registrationFormSlug: options?.registrationFormSlug,
          };
        },
      },
    ],
    executionConfig: {
      canEdit: typeof options?.canEdit === "boolean" ? options?.canEdit : false,
      canDelete: false,
      // typeof options?.canDelete === "boolean" ? options?.canDelete : true,
    },
  };
};
