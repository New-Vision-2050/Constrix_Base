// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const MailFormConfig: FormConfig = {
  formId: "mail-provider-form",
  title: "",
  apiUrl: `${baseURL}/settings/login-way`,
  laravelValidation: {
    enabled: true,
    errorsPath: "errors",
  },
  sections: [
    {
      title: "",
      fields: [
        {
          name: "mail_driver",
          label: "Mail Driver",
          type: "text",
          placeholder: "Mail Driver",
        },
        {
          name: "mail_host",
          label: "Mail Host",
          type: "text",
          placeholder: "Mail Host",
        },
        {
          name: "mail_port",
          label: "Mail Port",
          type: "text",
          placeholder: "Mail Port",
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

  // Example onError handler
  onError: (values, error) => {
    console.log("Form submission failed with values:", values);
    console.log("Error details:", error);
  },
};
