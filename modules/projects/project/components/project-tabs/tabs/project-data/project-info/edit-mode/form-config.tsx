import { FormConfig } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export const ProjectInfoFormConfig = (): FormConfig => {
  const config: FormConfig = {
    formId: "project-info-form",
    title: "بيانات المشروع",
    sections: [
      {
        fields: [
          {
            name: "project_name",
            label: "اسم المشروع",
            type: "text",
            placeholder: "اسم المشروع",
          },
          {
            name: "project_type",
            label: "نوع المشروع",
            type: "text",
            placeholder: "نوع المشروع",
          },
          {
            name: "project_specialty",
            label: "تخصص المشروع",
            type: "text",
            placeholder: "تخصص المشروع",
          },
          {
            name: "approved_consultant",
            label: "الاستشاري المعتمد",
            type: "text",
            placeholder: "الاستشاري المعتمد",
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      project_name: "مشروع العقد الموحد لشركة الكهرباء",
      project_type: "تصميم وتطوير",
      project_specialty: "برمجة، تصميم، برمجيات",
      approved_consultant: "شركة المشروعات",
    },
    submitButtonText: "حفظ",
    cancelButtonText: "إلغاء",
    showReset: false,
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData: Record<string, unknown>) => {
      return await defaultSubmitHandler(formData, config, {
        url: "/projects/info",
        method: "PUT",
      });
    },
  };
  return config;
};

