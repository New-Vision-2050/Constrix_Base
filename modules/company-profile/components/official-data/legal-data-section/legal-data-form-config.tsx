import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const LegalDataFormConfig = () => {
  const LegalDataFormConfig: FormConfig = {
    formId: "company-official-data-form",
    apiUrl: `${baseURL}/write-the-url`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        columns: 4,
        fields: [
          {
            name: "registration_type",
            label: "نوع التسجل",
            type: "text",
            placeholder: "نوع التسجل",
            disabled: true,
            gridArea: 4,
          },
          {
            name: "registration_number",
            label: "ادخل رقم السجل التجاري / رقم الـ 700",
            type: "text",
            placeholder: "رقم السجل التجاري",
            disabled: true,
            gridArea: 2,
          },
          {
            name: "registration_start_date",
            label: "تاريخ الإصدار",
            type: "date",
            placeholder: "تاريخ الإصدار",
          },
          {
            name: "registration_end_date",
            label: "تاريخ الانتهاء",
            type: "date",
            placeholder: "تاريخ الانتهاء",
          },
          {
            name: "registration_type_two",
            label: "نوع التسجل",
            type: "text",
            placeholder: "نوع التسجل",
            disabled: true,
            gridArea: 4,
          },
          {
            name: "registration_number_two",
            label: "ادخل رقم الترخيص",
            type: "text",
            placeholder: "ادخل رقم الترخيص",
            disabled: true,
            gridArea: 2,
          },
          {
            name: "registration_start_date_two",
            label: "تاريخ الإصدار",
            type: "date",
            placeholder: "تاريخ الإصدار",
          },
          {
            name: "registration_end_date_two",
            label: "تاريخ الانتهاء",
            type: "date",
            placeholder: "تاريخ الانتهاء",
          },
        ],
      },
    ],
    initialValues: {
      registration_type: "سجل تجاري",
      registration_number: "70025865836",
      registration_start_date:  "2024/2/19",
      registration_end_date:  "2024/2/19",
      registration_type_two: "ترخيص",
      registration_number_two: "70025865836",
      registration_start_date_two:  "2024/2/19",
      registration_end_date_two:  "2024/2/19",

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
  return LegalDataFormConfig;
};
