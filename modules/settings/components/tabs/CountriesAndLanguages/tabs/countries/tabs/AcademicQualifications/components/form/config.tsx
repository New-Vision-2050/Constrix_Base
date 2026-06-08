import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const academicQualificationFormConfig: FormConfig = {
  formId: "academic-qualification-form",
  title: "إضافة مؤهل أكاديمي",
  apiUrl: `${baseURL}/academic_qualifications`,
  laravelValidation: {
    enabled: true,
    errorsPath: "errors",
  },
  sections: [
    {
      fields: [
        {
          name: "name",
          label: "اسم المؤهل",
          type: "text",
          placeholder: "برجاء إدخال اسم المؤهل",
          validation: [{ type: "required", message: "اسم المؤهل مطلوب" }],
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
