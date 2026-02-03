import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { officialData } from "@/modules/company-profile/types/company";
import { useQueryClient } from "@tanstack/react-query";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useParams } from "@i18n/navigation";
import { useTranslations } from "next-intl";

export const CompanyOfficialData = (
  officialData: officialData,
  id?: string
) => {
  const { company_id }: { company_id: string | undefined } = useParams();
  console.log("officialData", officialData);
  const queryClient = useQueryClient();
  const t = useTranslations("UserProfile.header.officialData");

  const OfficialDataFormConfig: FormConfig = {
    formId: `company-official-data-form-${id}-${company_id}`,
    // apiUrl: `${baseURL}/companies/company-profile/official-data`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        columns: 2,
        fields: [
          {
            name: "name",
            label: t("name"),
            type: "text",
            placeholder: t("enterCompanyName"),
            disabled: true,
          },
          {
            name: "branch_name",
            label: t("branch"),
            type: "text",
            placeholder: t("enterBranch"),
            validation: [
              {
                type: "required",
                message: t("branchRequired"),
              },
            ],
          },
          {
            name: "name_en",
            label: t("nameEn"),
            type: "text",
            placeholder: t("enterNameEn"),
            validation: [
              {
                type: "required",
                message: t("nameEnRequired"),
              },
            ],
            gridArea: 2,
          },
          {
            name: "company_type_id",
            label: t("companyType"),
            type: "select",
            placeholder: t("selectCompanyType"),
            dynamicOptions: {
              url: `${baseURL}/company_types`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
            },
            validation: [
              {
                type: "required",
                message: t("companyTypeRequired"),
              },
            ],
          },
          {
            name: "country",
            label: t("countryName"),
            type: "text",
            placeholder: t("enterCountryName"),
            disabled: true,
          },
          {
            name: "company_field",
            label: t("companyField"),
            type: "text",
            placeholder: t("enterCompanyField"),
            disabled: true,
          },
          {
            name: "phone",
            label: t("phone"),
            type: "phone",
            placeholder: t("enterPhone"),
            validation: [
              {
                type: "phone",
                message: t("invalidPhone"),
              },
              {
                type: "required",
                message: t("phoneRequired"),
              },
            ],
          },
          {
            name: "email",
            label: t("email"),
            type: "text",
            placeholder: t("enterEmail")  ,
            validation: [
              {
                type: "required",
                message: t("emailRequired"),
              },
              {
                type: "email",
                message: t("invalidEmail"),
              },
            ],
          },
          {
            name: "program_id",
            label: t("companyAccessPrograms"),
            type: "select",
            placeholder: t("selectCompanyAccessPrograms")   ,
            dynamicOptions: {
              url: `${baseURL}/company_access_programs/list?company_field=${officialData?.company_field.map(
                (item) => item.id
              )}&country_id=${officialData?.country_id}`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
              dependsOn: "company_type_id",
              filterParam: "company_type_id",
            },
          },
          {
            name: "packages",
            label: t("packages"),
            type: "select",
            placeholder: t("selectPackages"),
            dynamicOptions: {
              url: `${baseURL}/packages/list`,
              valueField: "id",
              labelField: "name",
              searchParam: "name",
              paginationEnabled: true,
              pageParam: "page",
              limitParam: "per_page",
              itemsPerPage: 10,
              totalCountHeader: "X-Total-Count",
              dependsOn: "program_id",
              filterParam: "company_access_program_id",
            },
          },
        ],
      },
    ],
    initialValues: {
      name: officialData?.name ?? "",
      branch_name: officialData?.branch ?? "",
      name_en: officialData?.name_en ?? "",
      company_type_id: officialData?.company_type_id ?? "",
      country: officialData?.country_name ?? "",
      company_field:
        !!officialData?.company_field && officialData?.company_field.length > 0
          ? officialData?.company_field.map((field) => field.name).join(" , ")
          : "",
      phone: officialData?.phone ?? "",
      email: officialData?.email ?? "",
      bucket: t("packagesPremium"),
      program_id:
        !!officialData?.company_access_programs &&
        officialData?.company_access_programs.length > 0
          ? officialData?.company_access_programs
              .map((program) => program.id)
              .join(" , ")
          : "",
      packages:
        !!officialData?.packages && officialData?.packages.length > 0
          ? officialData?.packages.map((pack) => pack.id)
          : "",
    },
    submitButtonText: t("save"),
    cancelButtonText: t("cancel"),
    showReset: false,
    resetButtonText: t("clearForm"),
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    apiHeaders: {
      method: "PUT",
    },

    onSubmit: async (formData: Record<string, unknown>) => {
      const transformedValues = { ...formData };
      if (transformedValues.packages) {
        transformedValues.packages = Array.isArray(transformedValues.packages)
          ? transformedValues.packages
          : [transformedValues.packages];
      }
      return await defaultSubmitHandler(
        transformedValues,
        OfficialDataFormConfig,
        {
          config: {
            params: {
              ...(id && { branch_id: id }),
              ...(company_id && { company_id }),
            },
          },
          url: `${baseURL}/companies/company-profile/official-data`,
          method: "PUT",
        }
      );
    },

    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["main-company-data", id, company_id],
      });
    },
  };
  return OfficialDataFormConfig;
};
