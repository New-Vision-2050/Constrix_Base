import { FormConfig } from "@/modules/form-builder";
import { apiClient } from "@/config/axios-config";
import { officialData } from "@/modules/company-profile/types/company";
import { useQueryClient } from "@tanstack/react-query";

export const CompanyOfficialData = (
  officialData: officialData,
  id?: string
) => {
  const queryClient = useQueryClient();
  const PersonalFormConfig: FormConfig = {
    formId: `company-official-data-form-${id}`,
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
            name: "company_type",
            label: "كيان الشركة",
            type: "text",
            placeholder: "كيان الشركة",
            disabled: true,
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
      company_type: officialData?.company_type ?? "",
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
      const config = id ? { params: { branch_id: id } } : undefined;

      const response = await apiClient.put(
        "companies/company-profile/official-data",
        formData,
        config
      );

      if (response.status === 200) {
        queryClient.refetchQueries({
          queryKey: ["main-company-data", id],
        });
      }

      return {
        success: true,
        message: "dummy return",
        data: response.data,
      };
    },
  };
  return PersonalFormConfig;
};
