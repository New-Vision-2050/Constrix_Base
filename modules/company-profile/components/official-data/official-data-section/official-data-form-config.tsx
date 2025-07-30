import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import { officialData } from "@/modules/company-profile/types/company";
import { useQueryClient } from "@tanstack/react-query";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useParams } from "next/navigation";

export const CompanyOfficialData = (
  officialData: officialData,
  id?: string
) => {
  const { company_id }: { company_id: string | undefined } = useParams();
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
            label: "اسم الشركة",
            type: "text",
            placeholder: "اسم الشركة",
            disabled: true,
          },
          {
            name: "branch_name",
            label: "اسم الفرع",
            type: "text",
            placeholder: "اسم الفرع",
            validation: [
              {
                type: "required",
                message: "اسم الفرع مطلوب",
              },
            ],
          },
          {
            name: "name_en",
            label: "اسم الشركة بالانجليزي",
            type: "text",
            placeholder: "يجب كتابة الاسم باللغة الانجليزية",
            validation: [
              {
                type: "required",
                message: "اسم الشركة مطلوب",
              },
            ],
            gridArea: 2,
          },
          {
            name: "company_type_id",
            label: "كيان الشركة",
            type: "select",
            placeholder: "كيان الشركة",
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
                message: "كيان الشركة مطلوب",
              },
            ],
          },
          {
            name: "country",
            label: "دولة المركز الرئيسي",
            type: "text",
            placeholder: "دولة المركز الرئيسي",
            disabled: true,
          },
          {
            name: "company_field",
            label: "مجال الشركة",
            type: "text",
            placeholder: "مجال الشركة",
            disabled: true,
          },
          {
            name: "phone",
            label: "رقم الجوال",
            type: "phone",
            placeholder: "رقم الجوال",
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
            label: "البريد الالكتروني",
            type: "text",
            placeholder: "البريد الالكتروني",
            validation: [
              {
                type: "required",
                message: "ادخل البريد الالكتروني",
              },
              {
                type: "email",
                message: "البريد الالكتروني غير صحيح",
              },
            ],
          },
          {
            name: "program_id",
            label: "البرنامج",
            type: "select",
            placeholder: "البرنامج",
            dynamicOptions: {
              url: `${baseURL}/company_access_programs/list?company_field=${officialData?.company_field.map(
                (item) => item.id
              )}&country_id=${
                officialData?.country_id
              }`,
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
            name: "Package_id",
            label: "الباقة",
            type: "select",
            placeholder: "الباقة",
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
              filterParam: "company_access_programs",
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
              .map((program) => program.name)
              .join(" , ")
          : "",
      Package_id:
        !!officialData?.packages && officialData?.packages.length > 0
          ? officialData?.packages.map((pack) => pack.name).join(" , ")
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
      if (transformedValues.Package_id) {
        transformedValues.Package_id = [transformedValues.Package_id];
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
