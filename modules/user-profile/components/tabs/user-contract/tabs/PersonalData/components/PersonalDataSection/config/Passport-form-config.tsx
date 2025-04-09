import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import {
  temporaryDomain,
  temporaryToken,
} from "@/modules/dashboard/constants/dummy-domain";

export const PassportDataFormConfig = () => {
  const PassportFormConfig: FormConfig = {
    formId: "Passport-data-form",
    title: "بيانات جواز السفر",
    apiUrl: `${temporaryDomain}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: "بيانات جواز السفر",
        fields: [
          {
            name: "passportNumber",
            label: "رقم جواز السغر",
            type: "text",
            placeholder: "رقم جواز السغر",
          },
          {
            label: "تاريخ الأستلام",
            type: "date",
            name: "dateOfReceipt",
            placeholder: "تاريخ الأستلام",
          },
          {
            label: "تاريخ الأنتهاء",
            type: "date",
            name: "endDate",
            placeholder: "تاريخ الأنتهاء",
          },
          {
            label: "ارفاق الهوية",
            type: "image",
            name: "passport",
            placeholder: "ارفاق الهوية",
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
  return PassportFormConfig;
};
