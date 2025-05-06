import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { officialData } from "@/modules/company-profile/types/company";
import { useQueryClient } from "@tanstack/react-query";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useParams } from "next/navigation";

export const CompanyOfficialData = (
  officialData: officialData,
  id?: string
) => {
  const { company_id }: { company_id: string | undefined } = useParams();

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
            name: "bucket",
            label: "الباقة",
            type: "text",
            placeholder: "الباقة",
            disabled: true,
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
      return await defaultSubmitHandler(formData, OfficialDataFormConfig, {
        config: {
          params: {
            ...(id && { branch_id: id }),
            ...(company_id && { company_id }),
          },
        },
        url: `${baseURL}/companies/company-profile/official-data`,
        method: "PUT",
      });
    },

    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["main-company-data", id, company_id],
      });
    },
  };
  return OfficialDataFormConfig;
};
