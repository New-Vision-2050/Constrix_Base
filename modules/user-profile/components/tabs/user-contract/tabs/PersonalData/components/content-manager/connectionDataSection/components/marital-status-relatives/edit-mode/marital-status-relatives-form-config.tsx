import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";

export const MaritalStatusRelativesFormConfig = () => {
  const maritalStatusRelativesFormConfig: FormConfig = {
    formId: "ConnectionInformation-data-form",
    title: "الحالة الاجتماعية / الاقارب",
    apiUrl: `${baseURL}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "maritalStatus",
            label: "الحالة الاجتماعية",
            type: "text",
            placeholder: "الحالة الاجتماعية",
          },
          {
            name: "personName",
            label: "اسم شخص في حالة الطواري",
            type: "text",
            placeholder: "اسم شخص في حالة الطواري",
          },
          {
            name: "postalAddress2",
            label: "علاقة الشخص بحاله الطواري",
            type: "text",
            placeholder: "علاقة الشخص بحاله الطواري",
          },
          {
            name: "phone",
            label: " رقم الهاتف الخاص بجهة اتصال في حالة الطوارئ",
            type: "text",
            placeholder: " رقم الهاتف الخاص بجهة اتصال في حالة الطوارئ",
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
  return maritalStatusRelativesFormConfig;
};
