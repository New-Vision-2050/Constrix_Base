import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";
import useCompanyStore from "../../store/useCompanyOfficialData";

export const ReqOfficialDataEdit = () => {
  const { company } = useCompanyStore();
  const PersonalFormConfig: FormConfig = {
    formId: "ReqOfficialDataEdit",
    title: "طلب تعديل البيانات الرسمية",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            type: "select",
            name: "country_id",
            label: "دولة الشركة",
            placeholder: "اختر دولة الشركة",
            required: true,
            dynamicOptions: {
              url: `${baseURL}/countries`,
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
                message: "ادخل دولة الشركة",
              },
            ],
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
            type: "text",
            placeholder: "رقم الجوال",
            validation: [
              {
                type: "required",
                message: "رقم الجوال مطلوب",
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
                message: "البريد الالكتروني مطلوب",
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
      name: company?.name ?? "",
      branch: company?.main_branch?.name ?? "",
      name_en: company?.name_en ?? "",
      company_type: company?.company_type ?? "",
      country: company?.country_id ?? "",
      company_field: company?.company_field ?? "",
      phone: company?.phone ?? "",
      email: company?.email ?? "",
      bucket: "متميز",
    },
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData: Record<string, unknown>) => {
      return {
        success: true,
        message: "dummy return",
        data: {},
      };
    },
  };
  return PersonalFormConfig;
};
