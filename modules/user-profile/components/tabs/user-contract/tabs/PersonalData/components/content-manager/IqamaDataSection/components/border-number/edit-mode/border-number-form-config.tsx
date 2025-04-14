import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";

export const BorderNumberFormConfig = () => {
  const borderNumberFormConfig: FormConfig = {
    formId: "ConnectionInformation-data-form",
    title: "بيانات رقم الحدود - الدخول",
    apiUrl: `${baseURL}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "borderNumber",
            label: "رقم الحدود",
            type: "text",
            placeholder: "رقم الحدود",
          },
          {
            name: "start_data",
            label: "تاريخ الدخول",
            type: "date",
            placeholder: "تاريخ الدخول",
          },
          {
            name: "end_date",
            label: "تاريخ الانتهاء",
            type: "date",
            placeholder: "تاريخ الانتهاء",
          },
          {
            name: "attachment",
            label: "ارفاق رقم الحدود",
            type: "text",
            placeholder: "ارفاق رقم الحدود",
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
      const response = await apiClient.put(
        `${baseURL}/company-users/contact-info`,
        body
      );
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
  return borderNumberFormConfig;
};
