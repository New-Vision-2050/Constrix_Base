// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";

export const MailProviderConfig = (id: string) => {
  const MailFormConfig: FormConfig = {
    formId: "mail-provider-form",
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
            name: "MAIL_MAILER",
            label: "Mail Mailer",
            type: "text",
            placeholder: "Mail Mailer",
          },
          {
            name: "MAIL_HOST",
            label: "Mail Host",
            type: "text",
            placeholder: "Mail Host",
          },
          {
            name: "MAIL_PORT",
            label: "Mail Port",
            type: "text",
            placeholder: "Mail Port",
          },
          {
            name: "MAIL_PASSWORD",
            label: "Mail Password",
            type: "text",
            placeholder: "Mail Password",
          },
          {
            name: "MAIL_USERNAME",
            label: "Mail UserName",
            type: "text",
            placeholder: "Mail UserName",
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
      await apiClient.put(`${baseURL}/settings/driver/${id}`, body);
    },
    // Example onError handler
    onError: (values, error) => {
      console.log("Form submission failed with values:", values);
      console.log("Error details:", error);
    },
  };
  return MailFormConfig;
};
