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
import { Trash2, UserIcon } from "lucide-react";
import DeleteSpecificRowDialog from "@/modules/users/components/DeleteSpecificRow";
import { ModelsTypes } from "@/modules/users/components/users-sub-entity-form/constants/ModelsTypes";
import { employeeFormConfig } from "@/modules/form-builder/configs/employeeFormConfig";
import { editIndividualClientFormConfig } from "@/modules/form-builder/configs/editIndividualClientFormConfig";
import { editIndividualBrokerFormConfig } from "@/modules/form-builder/configs/editIndividualBrokerFormConfig";
import { editIndividualEmployeeFormConfig } from "@/modules/form-builder/configs/editIndividualEmployeeFormConfig";
import { useCRMSharedSetting } from "@/modules/crm-settings/hooks/useCRMSharedSetting";
import useUserData from "@/hooks/use-user-data";
import { useRouter } from "@i18n/navigation";
import SubEntityStatusSwitch from "@/modules/users/components/SubEntityStatusSwitch";
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
  identity_entry?: string | null;
  [key: string]: any; // For any other properties
}

// Create a component that uses the translations
export const UsersConfigV2 = (options?: {
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  registrationFormSlug?: string;
  isShareClient?: boolean;
  isShareBroker?: boolean;
  currentUserId?: string;
  handleRefreshWidgetsData?: () => void;
  tableId?: string;
}) => {
  const router = useRouter();
  const t = useTranslations("Companies");
  const tSubTable = useTranslations("Companies.SubEntitiesTable");
  const tEditSubEntity = useTranslations("EditSubEntityMessages");
  const tUsers = useTranslations("Users");
  // define final form config for EDIT mode
  // Note: This config is used when clicking "Edit" button in the table
  const finalFormConfig = useMemo(() => {
    const { isShareClient, isShareBroker, currentUserId } = options || {};
    const registrationFromConfig = options?.registrationFormSlug;
    // client model - use simplified edit form
    if (registrationFromConfig === ModelsTypes.CLIENT) {
      return editIndividualClientFormConfig(
        tEditSubEntity,
        undefined,
        isShareClient,
        currentUserId,
      );
    }
    // broker model - use simplified edit form
    if (registrationFromConfig === ModelsTypes.BROKER) {
      return editIndividualBrokerFormConfig(
        tEditSubEntity,
        undefined,
        isShareBroker,
        currentUserId,
      );
    }
    // employee model - use simplified edit form
    if (registrationFromConfig === ModelsTypes.EMPLOYEE) {
      return editIndividualEmployeeFormConfig(tEditSubEntity);
    }
    // default fallback (company user form)
    return GetCompanyUserFormConfig(t, undefined, tUsers);
  }, [
    options?.registrationFormSlug,
    t,
    options?.isShareClient,
    options?.isShareBroker,
    options?.currentUserId,
  ]);

  return {
    url: `${baseURL}/company-users`,
    tableId: "users-table-v2", // Add tableId to the config
    columns: [
      {
        key: "name",
        label: tSubTable("Name"),
        sortable: true,
        searchable: true,
        render: (_: unknown, row: UserTableRow) => (
          <div className="flex items-center gap-2">
            <AvatarGroup
              fullName={row.name}
              alt={row.name}
              src={row.photo || row.image_url || undefined}
            />
            {row.name}
          </div>
        ),
      },
      {
        key: "job_title",
        label: tSubTable("JobTitle"),
      },
      {
        key: "residence",
        label: tSubTable("ResidenceNumber"),
        render: (_: unknown, row: UserTableRow) => {
          const identityEntry = row.identity_entry;
          if (identityEntry != null && identityEntry !== "") {
            return String(identityEntry);
          }

          const identity = row.identity;
          if (identity == null || identity === "") return "—";
          if (typeof identity === "object") {
            const identityValue = (identity as { identity?: string }).identity;
            return identityValue != null && identityValue !== ""
              ? identityValue
              : "—";
          }
          return String(identity);
        },
      },
      {
        key: "email",
        label: t("Email"),
        sortable: true,
      },
      {
        key: "phone",
        label: tSubTable("Phone"),
        render: (_: unknown, row: UserTableRow) => {
          // const companies = row.companies || [];
          return (
            <div className="line-clamp-3 flex flex-col items-start justify-start">
              {/* {companies.map((company) => (
                <p
                  key={company.id}
                  className="line-clamp-1 h-5"
                  dir={"ltr"}
                  style={{ width: "fit-content" }}
                >
                  {company?.phone || ""}
                </p>
              ))} */}
              <p>{row.phone || ""}</p>
            </div>
          );
        },
      },
      {
        key: "branch",
        label: tSubTable("Branch"),
        sortable: true,
      },
      {
        key: "broker",
        label: tSubTable("Broker"),
      },
      {
        key: "number_of_projects",
        label: tSubTable("NumberOfProjects"),
        sortable: true,
      },
      {
        key: "companies",
        label: tSubTable("Company"),
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
        label: tSubTable("ContractEndDate"),
        sortable: true,
        render: (value: unknown) =>
          value != null && value !== "" ? String(value) : "—",
      },
      {
        key: "user-type",
        label: tSubTable("UserType"),
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
                          role.status === -1 && "text-[#F19B02]",
                        )}
                      >
                        {React.createElement(
                          rulesIcons[(index + 1) as keyof typeof rulesIcons],
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
      // Extended attribute columns
      { key: "phone_code", label: tSubTable("PhoneCode") },
      { key: "nickname", label: tSubTable("Nickname") },
      {
        key: "birthdate_gregorian",
        label: tSubTable("BirthdateGregorian"),
        render: (value: unknown) =>
          value != null && value !== "" ? String(value) : "—",
      },
      { key: "birthdate_hijri", label: tSubTable("BirthdateHijri") },
      { key: "nationality", label: tSubTable("Nationality") },
      { key: "address", label: tSubTable("Address") },
      { key: "postal_code", label: tSubTable("PostalCode") },
      { key: "landline_number", label: tSubTable("LandlineNumber") },
      { key: "other_phone", label: tSubTable("OtherPhone") },
      { key: "marital-status", label: tSubTable("MaritalStatus") },
      { key: "management", label: tSubTable("Management") },
      { key: "department", label: tSubTable("Department") },
      { key: "job_type", label: tSubTable("JobType") },
      { key: "job_code", label: tSubTable("JobCode") },
      {
        key: "attendance_constraint",
        label: tSubTable("AttendanceConstraint"),
        render: (value: unknown) => {
          const getItemLabel = (item: unknown): string => {
            if (item == null) return "";
            if (typeof item === "string") return item;
            if (typeof item === "object") {
              const obj = item as {
                id?: string;
                constraint_name?: string;
                name?: string;
              };
              return obj.constraint_name ?? obj.name ?? "";
            }
            return String(item);
          };

          if (value == null) return "—";

          if (Array.isArray(value)) {
            const items = value.map(getItemLabel).filter(Boolean);
            if (items.length === 0) return "—";
            return (
              <div className="flex flex-col items-start">
                {items.map((label, index) => (
                  <p key={index} className="line-clamp-1 h-5">
                    {label}
                  </p>
                ))}
              </div>
            );
          }

          const label = getItemLabel(value);
          return label || "—";
        },
      },
      { key: "passport", label: tSubTable("Passport") },
      { key: "border_number", label: tSubTable("BorderNumber") },
      { key: "work_permit", label: tSubTable("WorkPermit") },
      {
        key: "whatsapp",
        label: tSubTable("Whatsapp"),
        render: (value: unknown) => {
          if (value == null || value === "") return "—";
          const link = String(value);
          const href = link.startsWith("http")
            ? link
            : link.startsWith("wa.me")
              ? `https://${link}`
              : `https://wa.me/${link.replace(/\D/g, "")}`;
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary hover:opacity-80 whitespace-nowrap"
              onClick={(e) => e.stopPropagation()}
            >
              {link}
            </a>
          );
        },
      },
      {
        key: "bank_account",
        label: tSubTable("BankAccount"),
        render: (value: unknown) => {
          if (value == null || value === "") return "—";
          if (typeof value === "string") return value;
          if (typeof value === "object") {
            const account = value as { account_number?: string; iban?: string };
            return account.account_number ?? account.iban ?? "—";
          }
          return "—";
        },
      },
      { key: "linkedin", label: tSubTable("Linkedin") },
      { key: "facebook", label: tSubTable("Facebook") },
      { key: "instagram", label: tSubTable("Instagram") },
      { key: "telegram", label: tSubTable("Telegram") },
      { key: "snapchat", label: tSubTable("Snapchat") },
      {
        key: "currency",
        label: tSubTable("Currency"),
        render: (value: any) => value?.name ?? "",
      },
      { key: "time_zone", label: tSubTable("TimeZone") },
      { key: "language", label: tSubTable("Language") },
      {
        key: "bank-info",
        label: tSubTable("BankInfo"),
        render: (value: any) => value ?? "—",
      },
      {
        key: "salary-info",
        label: tSubTable("SalaryInfo"),
        render: (value: any) => value != null ? value : "—",
      },
      {
        key: "employment-info",
        label: tSubTable("EmploymentInfo"),
        render: (value: any) => value ?? "—",
      },
      {
        key: "contact-info",
        label: tSubTable("ContactInfo"),
        render: (value: any) => value ?? "—",
      },
      {
        key: "social-media",
        label: tSubTable("SocialMedia"),
        render: (value: any) => value ?? "—",
      },
      {
        key: "family-info",
        label: tSubTable("FamilyInfo"),
        render: (value: any) => value
          ? <span className="max-w-[200px] line-clamp-2 block text-start">{value}</span>
          : "—",
      },
      {
        key: "about-me",
        label: tSubTable("AboutMe"),
        render: (value: any) => value
          ? <span title={value}>{value.length > 60 ? value.substring(0, 60) + '...' : value}</span>
          : "—",
      },
      {
        key: "cv",
        label: tSubTable("CV"),
        render: (value: any) => value
          ? <a href={value} target="_blank" rel="noopener noreferrer" className="underline text-primary hover:opacity-80 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>{tSubTable("OpenCV")}</a>
          : "—",
      },
      {
        key: "certificates",
        label: tSubTable("Certificates"),
        render: (value: any) => value
          ? <span className="max-w-[200px] line-clamp-2 block text-start">{value}</span>
          : "—",
      },
      {
        key: "qualification",
        label: tSubTable("Qualification"),
        render: (value: any) => value
          ? <span className="max-w-[200px] line-clamp-2 block text-start">{value}</span>
          : "—",
      },
      {
        key: "experience",
        label: tSubTable("Experience"),
        render: (value: any) => value
          ? <span className="max-w-[200px] line-clamp-2 block text-start">{value}</span>
          : "—",
      },
      {
        key: "courses",
        label: tSubTable("Courses"),
        render: (value: any) => value
          ? <span title={value}>{value.length > 50 ? value.substring(0, 50) + '...' : value}</span>
          : "—",
      },
      {
        key: "work-license",
        label: tSubTable("WorkLicense"),
        render: (value: any) => value ?? "—",
      },
      {
        key: "privileges",
        label: tSubTable("Privileges"),
        render: (value: any) => value
          ? <span className="max-w-[200px] line-clamp-2 block text-start">{value}</span>
          : "—",
      },
      {
        key: "official-data",
        label: tSubTable("OfficialData"),
        render: (value: any) => value ?? "—",
      },
      {
        key: "job-offer",
        label: tSubTable("JobOffer"),
        render: (value: any) => value ?? "—",
      },
      {
        key: "contract-work",
        label: tSubTable("ContractWork"),
        render: (value: any) => value ?? "—",
      },
      { key: "contract_duration", label: tSubTable("ContractDuration"), render: (value: any) => value != null ? value : "—" },
      {
        key: "education",
        label: tSubTable("Education"),
        render: (value: any) => value
          ? <span className="max-w-[200px] line-clamp-2 block text-start">{value}</span>
          : "—",
      },
      {
        key: "passport-info",
        label: tSubTable("PassportInfo"),
        render: (value: any) => value ?? "—",
      },
      {
        key: "residence-info",
        label: tSubTable("ResidenceInfo"),
        render: (value: any) => value ?? "—",
      },
      { key: "iban", label: tSubTable("IBAN") },
      { key: "contract_number", label: tSubTable("ContractNumber") },
      { key: "contract_start_date", label: tSubTable("ContractStartDate") },
      { key: "notice_period", label: tSubTable("NoticePeriod") },
      { key: "salary", label: tSubTable("Salary") },
      {
        key: "status",
        label: "الحالة",
        render: (_: unknown, row: UserTableRow) => (
          <SubEntityStatusSwitch
            id={row.id}
            userId={row.user_id}
            status={row.status}
            entityType={options?.registrationFormSlug ?? ""}
            tableId={options?.tableId}
            handleRefreshWidgetsData={options?.handleRefreshWidgetsData}
          />
        ),
      },
    ],
    allSearchedFields: [
      {
        key: "company_id",
        name: "companies",
        searchType: {
          type: "dropdown",
          placeholder: tSubTable("Company"),
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
          placeholder: tSubTable("EmailOrPhone"),
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
      "status",
      "branch",
      "job_title",
      "residence",
      "broker",
      "number_of_projects",
      "end_date",
    ],
    alwaysVisibleColumnKeys: ["status"],
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
      ...(options?.registrationFormSlug === ModelsTypes.EMPLOYEE
        ? [
            {
              id: "complete-profile",
              label: tSubTable("CompleteProfile"),
              icon: <GearIcon className="w-4 h-4" />,
              action: "complete-profile",
              dialogComponent: ChooseUserCompany,
              disabled: !options?.canEdit,
              dialogProps: (row: UserTableRow) => {
                return {
                  user: row,
                };
              },
            },
          ]
        : [
            {
              id: "complate-client-profile",
              label:
                options?.registrationFormSlug === ModelsTypes.CLIENT
                  ? tSubTable("CompleteClientProfile")
                  : tSubTable("CompleteBrokerProfile"),
              action: (row: UserTableRow) => {
                router.push(
                  `/client-profile/${row.user_id}?role=${
                    options?.registrationFormSlug === ModelsTypes.CLIENT
                      ? "2"
                      : "3"
                  }`,
                );
              },
              icon: <UserIcon className="w-4 h-4" />,
            },
          ]),
      {
        id: "user-settings",
        label:
          options?.registrationFormSlug === ModelsTypes.CLIENT
            ? tSubTable("ClientSettings")
            : options?.registrationFormSlug === ModelsTypes.BROKER
              ? tSubTable("BrokerSettings")
              : tSubTable("EmployeeSettings"),
        icon: <GearIcon className="w-4 h-4" />,
        action: "user-settings",
        dialogComponent: UserSettingDialog,
        disabled: !options?.canView,
        dialogProps: (row: UserTableRow) => {
          return {
            user: row,
            title:
              options?.registrationFormSlug === ModelsTypes.CLIENT
                ? tSubTable("ClientSettings")
                : options?.registrationFormSlug === ModelsTypes.BROKER
                  ? tSubTable("BrokerSettings")
                  : tSubTable("EmployeeSettings"),
          };
        },
      },
      {
        id: "delete-user",
        label: tSubTable("Delete"),
        action: "delete-user",
        icon: <Trash2 className="w-4 h-4 text-red-500" />,
        dialogComponent: DeleteSpecificRowDialog,
        disabled: Boolean(!options?.canDelete),
        dialogProps: (row: UserTableRow) => {
          return {
            user: row,
            registrationFormSlug: options?.registrationFormSlug,
            handleRefreshWidgetsData: options?.handleRefreshWidgetsData,
            tableId: options?.tableId,
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
