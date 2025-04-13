import { FormConfig } from "@/modules/form-builder";
import { apiClient } from "@/config/axios-config";
import {
  temporaryDomain,
  temporaryToken,
} from "@/modules/dashboard/constants/dummy-domain";

export const SocialMediaSitesFormConfig = () => {
  const socialMediaSitesFormConfig: FormConfig = {
    formId: "ConnectionInformation-data-form",
    title: "حسابات التواصل الاجتماعي",
    apiUrl: `${temporaryDomain}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: "حسابات التواصل الاجتماعي",
        fields: [
          {
            name: "whatsapp",
            label: "واتساب ",
            type: "text",
            placeholder: "واتساب ",
          },
          {
            name: "facebook",
            label: "فيسبوك ",
            type: "text",
            placeholder: "فيسبوك ",
          },
          {
            name: "telegram",
            label: "تيليجرام ",
            type: "text",
            placeholder: "تيليجرام ",
          },
          {
            name: "instagram",
            label: "انستقرام  ",
            type: "text",
            placeholder: "انستقرام  ",
          },
          {
            name: "snapchat",
            label: "سناب شات  ",
            type: "text",
            placeholder: "سناب شات  ",
          },
          {
            name: "linkedin",
            label: "لينك اند  ",
            type: "text",
            placeholder: "لينك اند  ",
          },
        ]
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
        `${temporaryDomain}/company-users/contact-info`,
        body,
        {
          headers: {
            Authorization: `Bearer ${temporaryToken}`,
            "X-Tenant": "560005d6-04b8-53b3-9889-d312648288e3",
          },
        }
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
  return socialMediaSitesFormConfig;
};
