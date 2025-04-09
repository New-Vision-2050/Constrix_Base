import { FormConfig } from "@/modules/form-builder";
import { apiClient } from "@/config/axios-config";
import {
  temporaryDomain,
  temporaryToken,
} from "@/modules/dashboard/constants/dummy-domain";

export const IdentityDataFormConfig = () => {
  const IdentityFormConfig: FormConfig = {
    formId: "Identity-data-form",
    title: "بيانات الهوية",
    apiUrl: `${temporaryDomain}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: "بيانات الهوية",
        fields: [
          {
            name: "IdentityNumber",
            label: "رقم رقم الهوية",
            type: "text",
            placeholder: "رقم رقم الهوية",
          },
          {
            label: "رقم الاقامة",
            type: "text",
            name: "IqamNumber",
            placeholder: "رقم الاقامة",
          },
          {
            label: "رقم الدخول",
            type: "date",
            name: "endDate",
            placeholder: "رقم الدخول",
          },
          {
            label: "رقم جواز السفر",
            type: "text",
            name: "passportNumber",
            placeholder: "رقم جواز السفر",
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
  return IdentityFormConfig;
};
