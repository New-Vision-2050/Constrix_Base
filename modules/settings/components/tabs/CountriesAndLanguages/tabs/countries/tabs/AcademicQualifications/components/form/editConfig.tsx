import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const academicQualificationFormEditConfig: FormConfig = {
  formId: "academic-qualification-edit-form",
  title: "تعديل مؤهل أكاديمي",
  isEditMode: true,
  editApiUrl: `${baseURL}/academic_qualifications/:id`,
  apiUrl: `${baseURL}/academic_qualifications`,
  laravelValidation: {
    enabled: true,
    errorsPath: "errors",
  },
  editDataTransformer: (data: { id: string; name: string }) => ({
    id: data.id,
    name: data.name,
  }),
  sections: [
    {
      title: "تعديل مؤهل أكاديمي",
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
