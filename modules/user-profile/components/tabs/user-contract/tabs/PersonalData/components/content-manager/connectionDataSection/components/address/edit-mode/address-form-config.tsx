import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";

export const AddressFormConfig = () => {
  const addressFormConfig: FormConfig = {
    formId: "ConnectionInformation-data-form",
    title: "العنوان",
    apiUrl: `${baseURL}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
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
      const response = await apiClient.put(`/company-users/contact-info`, body);
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
