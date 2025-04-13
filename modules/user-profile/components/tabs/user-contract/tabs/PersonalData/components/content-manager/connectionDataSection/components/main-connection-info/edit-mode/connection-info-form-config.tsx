import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";

export const ConnectionInformationFormConfig = () => {
  const _ConnectionInformationFormConfig: FormConfig = {
    formId: "ConnectionInformation-data-form",
    title: "البيانات الاتصال",
    apiUrl: `${baseURL}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "phone",
            label: "رقم الجوال",
            type: "text",
            placeholder: "رقم الجوال",
          },
          {
            name: "email",
            label: "البريد الالكتروني",
            type: "text",
            placeholder: "البريد الالكتروني",
          },
          {
            name: "other_phone",
            label: "رقم   الجوال البديل",
            type: "text",
            placeholder: "رقم   الجوال البديل",
          },
          {
            name: "Landline_number",
            label: "رقم الهاتف الأرضي",
            type: "text",
            placeholder: "رقم الهاتف الأرضي",
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
        `$/company-users/contact-info`,
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
  return _ConnectionInformationFormConfig;
};
