import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const academicSpecializationFormConfig: FormConfig = {
  formId: "academic-specialization-form",
  title: "إضافة تخصص أكاديمي",
  apiUrl: `${baseURL}/academic_specializations`,
  laravelValidation: {
    enabled: true,
    errorsPath: "errors",
  },
  sections: [
    {
      fields: [
        {
          name: "name",
          label: "اسم التخصص",
          type: "text",
          placeholder: "برجاء إدخال اسم التخصص",
          validation: [{ type: "required", message: "اسم التخصص مطلوب" }],
        },
      ],
    },
  ],
  submitButtonText: "حفظ",
  cancelButtonText: "إلغاء",
  showReset: false,
  showSubmitLoader: true,
  resetOnSuccess: true,
  showCancelButton: false,
  showBackButton: false,
};
