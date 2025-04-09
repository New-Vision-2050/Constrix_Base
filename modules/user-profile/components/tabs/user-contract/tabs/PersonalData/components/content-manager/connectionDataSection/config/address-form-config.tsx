import { FormConfig } from "@/modules/form-builder";
import { apiClient } from "@/config/axios-config";
import {
  temporaryDomain,
  temporaryToken,
} from "@/modules/dashboard/constants/dummy-domain";

export const AddressFormConfig = () => {
  const addressFormConfig: FormConfig = {
    formId: "ConnectionInformation-data-form",
    title: "العنوان",
    apiUrl: `${temporaryDomain}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: "العنوان",
        fields: [
          {
            name: "address",
            label: "العنوان السكني بمقر العمل / وصف دقيق عنوان وطنى) ",
            type: "text",
            placeholder: "العنوان السكني بمقر العمل / وصف دقيق عنوان وطنى) ",
          },
          {
            name: "postalAddress",
            label: "العنوان البريدي",
            type: "text",
            placeholder: "العنوان البريدي",
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
  return addressFormConfig;
};
