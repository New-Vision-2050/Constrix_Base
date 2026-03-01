import { FormConfig } from "@/modules/form-builder";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";

export const ProjectDetailsFormConfig = (): FormConfig => {
  const config: FormConfig = {
    formId: "project-details-form",
    title: "تفاصيل المشروع",
    sections: [
      {
        fields: [
          {
            name: "project_manager",
            label: "مدير المشروع",
            type: "text",
            placeholder: "مدير المشروع",
          },
          {
            name: "market_capacity",
            label: "الطاقة السوقية",
            type: "text",
            placeholder: "الطاقة السوقية",
          },
          {
            name: "contract_date",
            label: "تاريخ العقد",
            type: "date",
            placeholder: "تاريخ العقد",
          },
          {
            name: "delivery_date",
            label: "تاريخ التسليم",
            type: "date",
            placeholder: "تاريخ التسليم",
          },
        ],
        columns: 2,
      },
    ],
    initialValues: {
      project_manager: "احمد خالد",
      market_capacity: "100,000 ريال",
      contract_date: "2024-01-01",
      delivery_date: "2025-09-30",
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
        url: "/projects/details",
        method: "PUT",
      });
    },
  };
  return config;
};

