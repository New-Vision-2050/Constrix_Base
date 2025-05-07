import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export function GetOrgStructureSettingsJobTypesFormConfig(): FormConfig {
  return {
    formId: "job-types-form",
    title: "اضافة نوع وظيفي",
    apiUrl: `${baseURL}/job_types`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors", // This is the default in Laravel
    },
    sections: [
      {
        title: "اضافة نوع وظيفي",
        fields: [
          {
            name: "name",
            label: "اسم نوع الوظيفة",
            type: "text",
            placeholder: "برجاء إدخال اسم نوع الوظيفة",
            required: true,
            validation: [
              {
                type: "required",
                message: `اسم نوع الوظيفة مطلوب`,
              },
            ],
          },
          {
            type: "select",
            name: "status",
            label: "الحالة",
            placeholder: "نشط / غير نشط",
            required: true,
            options: [
              { value: "1", label: "نشط" },
              { value: "0", label: "غير نشط" },
            ],
            validation: [
              {
                type: "required",
                message: "الحالة مطلوبة",
              },
            ],
          },
        ],
      },
    ],
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,
  };
}
