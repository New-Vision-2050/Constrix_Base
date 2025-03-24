// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";

export const SMSProviderConfig = (id: string) => {
  const SmsFormConfig: FormConfig = {
    formId: "sms-provider-form",
    title: "",
    apiUrl: `${baseURL}/settings/driver/${id}`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: "",
        fields: [
          {
            name: "SMS_MORA_KEY",
            label: "SMS MORA KEY",
            type: "text",
            placeholder: "SMS KEY",
          },
          {
            name: "SMS_MORA_SENDER",
            label: "SMS MORA SENDER",
            type: "text",
            placeholder: "SMS MORA SENDER",
          },
          {
            name: "SMS_MORA_USER",
            label: "SMS USER",
            type: "text",
            placeholder: "SMS USER",
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
        config: {
          ...formData,
        },
      };
      console.log("body-body", id, body);
      const response = await apiClient.put(`${baseURL}/settings/driver/${id}`, body);
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
  return SmsFormConfig;
};
