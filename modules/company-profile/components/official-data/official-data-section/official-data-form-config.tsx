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
  const t = useTranslations();
  console.log("officialData", officialData);
  const queryClient = useQueryClient();
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
            label: t("Sidebar.CompanyName"),
            type: "text",
            placeholder: t("Sidebar.CompanyName"),
            disabled: true,
          },
          {
            name: "branch_name",
            label: t("Sidebar.BranchName"),
            type: "text",
            placeholder: t("Sidebar.BranchName"),
            validation: [
              {
                type: "required",
                message: t("Sidebar.BranchName") + " مطلوب",
              },
            ],
          },
          {
            name: "name_en",
            label: t("Sidebar.CompanyNameInEnglish"),
            type: "text",
            placeholder: "يجب كتابة الاسم باللغة الانجليزية",
            validation: [
              {
                type: "required",
                message: t("Sidebar.CompanyName") + " مطلوب",
              },
            ],
            gridArea: 2,
          },
          {
            name: "company_type_id",
            label: t("Sidebar.CompanyEntity"),
            type: "select",
            placeholder: t("Sidebar.CompanyEntity"),
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
                message: t("Sidebar.CompanyEntity") + " مطلوب",
              },
            ],
          },
          {
            name: "country",
            label: t("Sidebar.HeadquarterCountry"),
            type: "text",
            placeholder: t("Sidebar.HeadquarterCountry"),
            disabled: true,
          },
          {
            name: "company_field",
            label: t("Sidebar.CompanyField"),
            type: "text",
            placeholder: t("Sidebar.CompanyField"),
            disabled: true,
          },
          {
            name: "phone",
            label: t("Sidebar.MobileNumber"),
            type: "phone",
            placeholder: t("Sidebar.MobileNumber"),
            validation: [
              {
                type: "phone",
                message: "",
              },
              {
                type: "required",
                message: "field is required",
              },
            ],
          },
          {
            name: "email",
            label: t("Sidebar.Email"),
            type: "text",
            placeholder: t("Sidebar.Email"),
            validation: [
              {
                type: "required",
                message: "ادخل " + t("Sidebar.Email"),
              },
              {
                type: "email",
                message: t("Sidebar.Email") + " غير صحيح",
              },
            ],
          },
          {
            name: "program_id",
            label: t("Sidebar.Program"),
            type: "select",
            placeholder: t("Sidebar.Program"),
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
            label: t("Sidebar.Package"),
            type: "select",
            placeholder: t("Sidebar.Package"),
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
      bucket: "متميز",
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
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
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
