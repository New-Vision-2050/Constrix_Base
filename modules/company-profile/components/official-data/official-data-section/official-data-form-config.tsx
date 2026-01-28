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
  const t = useTranslations("companyProfile");
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
              label: t("header.Label.CompanyName"),
            type: "text",
            placeholder: t("header.Label.CompanyName")  ,
            disabled: true,
          },
          {
            name: "branch_name",
            label: t("header.Label.BranchName") ,
            type: "text",
            placeholder: t("header.Label.BranchName") ,
            validation: [
              {
                type: "required",
                message: t("header.Label.BranchNameRequired"),
              },
            ],
          },
          {
            name: "name_en",
            label: t("header.Label.CompanyNameEnglish"),
            type: "text",
            placeholder: t("header.Label.CompanyNameEnglish") ,
            validation: [
              {
                type: "required",
                message: t("header.Label.CompanyNameEnglishRequired") ,
              },
            ],
            gridArea: 2,
          },
          {
            name: "company_type_id",
            label: t("header.Label.CompanyType"),
            type: "select",
            placeholder: t("header.Label.CompanyType")  ,
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
                message: t("header.Label.CompanyTypeRequired"),
              },
            ],
          },
          {
            name: "country",
            label: t("header.Label.MainCountry"),
            type: "text",
            placeholder: t("header.Label.MainCountry") ,
            disabled: true,
          },
          {
            name: "company_field",
            label: t("header.Label.CompanyField"),
            type: "text",
            placeholder: t("header.Label.CompanyField") ,
            disabled: true,
          },
          {
            name: "phone",
            label: t("header.Label.Phone"),
            type: "phone",
            placeholder: t("header.Label.Phone")  ,
            validation: [
              {
                type: "phone",
                message: "",
              },
              {
                type: "required",
                message: t("header.Label.PhoneRequired")  ,
              },
            ],
          },
          {
            name: "email",
            label: t("header.Label.Email"),
            type: "text",
            placeholder: t("header.Label.Email")    ,
            validation: [
              {
                type: "required",
                message: t("header.Label.EmailRequired")  ,
              },
              {
                  type: "email",
                message: t("header.Label.EmailInvalid")  ,
              },
            ],
          },
          {
            name: "program_id",
            label: t("header.Label.Program"),
            type: "select",
            placeholder: t("header.Label.Program"),
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
            label: t("header.Label.Bucket"),
            type: "select",
            placeholder: t("header.Label.Bucket") ,
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
      bucket: t("header.Label.Bucket"),
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
    submitButtonText: t("header.Label.Save"),
    cancelButtonText: t("header.Label.Cancel")  ,
    showReset: false,
    resetButtonText: "Clear Form",
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
