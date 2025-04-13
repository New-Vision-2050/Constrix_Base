import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";

export const IqamaDataFormConfig = () => {
  const iqamaDataFormConfig: FormConfig = {
    formId: "iqama-data-form",
    title: "بيانات الاقامة",
    apiUrl: `${baseURL}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "iqamaNumber",
            label: "رقم الاقامة",
            type: "text",
            placeholder: "رقم الاقامة",
          },
          {
            name: "exportDate",
            label: "تاريخ الاصدار",
            type: "date",
            placeholder: "تاريخ الاصدار",
          },
          {
            name: "endDate",
            label: "تاريخ الانتهاء",
            type: "date",
            placeholder: "تاريخ الانتهاء",
          },
          {
            name: "attachment",
            label: "ارفاق رقم الاقامة",
            type: "image",
            placeholder: "ارفاق رقم الاقامة",
          },
        ],
      },
    ],
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
    showCancelButton: false,
    showBackButton: false,

    // Example onSuccess handler
    onSuccess: (values, result) => {
      console.log("Form submitted successfully with values:", values);
      console.log("Result from API:", result);
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const body = {
        ...formData,
      };
      console.log("body-body", body);
      const response = await apiClient.put(`/company-users/contact-info`, body);
      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },

    // Example onError handler
    onError: (values, error) => {
      console.log("Form submission failed with values:", values);
      console.log("Error details:", error);
    },
  };
  return iqamaDataFormConfig;
};
