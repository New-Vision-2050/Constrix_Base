import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const LegalDataReqFormEditConfig = () => {
  const LegalDataReqFormEditConfig: FormConfig = {
    formId: "company-official-data-form",
    title: "طلب تعديل البيان القانوني",
    apiUrl: `${baseURL}/write-the-url`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "registration_type",
            label: "نوع التسجل",
            type: "select",
            options: [{ label: "سجل تجاري", value: "سجل تجاري" }],
            validation: [
              {
                type: "required",
                message: "ادخل مجال الشركة",
              },
            ],
          },
          {
            name: "registration_number",
            label: "ادخل رقم الترخيص",
            type: "text",
            placeholder: "ادخل رقم الترخيص",
          },
          {
            name: "registration_type_two",
            label: "نوع التسجل",
            type: "select",
            options: [{ label: "ترخيص", value: "ترخيص" }],
            validation: [
              {
                type: "required",
                message: "ادخل مجال الشركة",
              },
            ],
          },

          {
            name: "registration_number_two",
            label: "ادخل رقم الترخيص",
            type: "text",
            placeholder: "ادخل رقم الترخيص",
          },
        ],
      },
    ],
    initialValues: {
      registration_type: "سجل تجاري",
      registration_number: "70025865836",
      registration_type_two: "ترخيص",
      registration_number_two: "70025865836",
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
  return LegalDataReqFormEditConfig;
};
