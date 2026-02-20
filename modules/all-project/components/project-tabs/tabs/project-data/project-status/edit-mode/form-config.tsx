import { FormConfig } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export const ProjectStatusFormConfig = (): FormConfig => {
  const config: FormConfig = {
    formId: "project-status-form",
    title: "حالة المشروع",
    sections: [
      {
        fields: [
          {
            name: "project_status",
            label: "حالة المشروع",
            type: "select",
            placeholder: "حالة المشروع",
            options: [
              { label: "جاري", value: "in_progress" },
              { label: "مكتمل", value: "completed" },
              { label: "متوقف", value: "stopped" },
              { label: "ملغي", value: "cancelled" },
            ],
          },
          {
            name: "approval_percentage",
            label: "نسبة الاعتماد",
            type: "number",
            placeholder: "نسبة الاعتماد",
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      project_status: "in_progress",
      approval_percentage: 10,
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
        url: "/projects/status",
        method: "PUT",
      });
    },
  };
  return config;
};

