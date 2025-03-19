// Define the form configuration
import { FormConfig } from "@/modules/form-builder";
import { baseURL } from "@/config/axios-config";

export const SmsFormConfig: FormConfig = {
  formId: "sms-provider-form",
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
          name: "sms_code",
          label: "رمز الدخول",
          type: "text",
          placeholder: "ادخل رمز الدخول",
        },
        {
          name: "sms_re_code",
          label: "تاكيد رمز الدخول",
          type: "text",
          placeholder: "اعادة ادخال رمز الدخول",
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
