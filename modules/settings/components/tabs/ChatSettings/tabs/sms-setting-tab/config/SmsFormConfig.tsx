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
            name: "SMS_KEY",
            label: "SMS KEY",
            type: "text",
            placeholder: "SMS KEY",
          },
          {
            name: "SMS_SENDER",
            label: "SMS SENDER",
            type: "text",
            placeholder: "SMS SENDER",
          },
          {
            name: "SMS_USERNAME",
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
      await apiClient.put(`${baseURL}/settings/driver/${id}`, body);
    },

    // Example onError handler
    onError: (values, error) => {
      console.log("Form submission failed with values:", values);
      console.log("Error details:", error);
    },
  };
  return SmsFormConfig;
};
