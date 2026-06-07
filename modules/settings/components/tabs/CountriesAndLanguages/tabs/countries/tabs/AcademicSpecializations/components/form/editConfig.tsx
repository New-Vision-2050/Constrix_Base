import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const academicSpecializationFormEditConfig: FormConfig = {
  formId: "academic-specialization-edit-form",
  title: "تعديل تخصص أكاديمي",
  isEditMode: true,
  editApiUrl: `${baseURL}/academic_specializations/:id`,
  apiUrl: `${baseURL}/academic_specializations`,
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
      title: "تعديل تخصص أكاديمي",
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
