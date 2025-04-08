import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import {
  temporaryDomain,
  temporaryToken,
} from "@/modules/dashboard/constants/dummy-domain";

export const PersonalDataFormConfig = () => {
  const PersonalFormConfig: FormConfig = {
    formId: "personal-data-form",
    title: "البيانات الشخصية",
    apiUrl: `${temporaryDomain}/company-users/data-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: "البيانات الشخصية",
        fields: [
          {
            name: "name",
            label: "Name",
            type: "text",
            placeholder: "Name",
          },
          {
            name: "nickname",
            label: "nick name",
            type: "text",
            placeholder: "nick name",
          },
          {
            name: "gender",
            label: "Gender",
            type: "select",
            placeholder: "Gender",
            options: [
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ],
          },
          {
            name: "is_default",
            label: "Is Default?",
            type: "checkbox",
            placeholder: "Is Default?",
          },
          {
            name: "birthdate_gregorian",
            label: "Birthdate Gregorian",
            type: "date",
            placeholder: "Birthdate Gregorian",
          },
          {
            name: "birthdate_hijri",
            label: "Birthdate Hijri",
            type: "date",
            placeholder: "Birthdate Hijri",
          },
          {
            name: "nationality",
            label: "Nationality",
            type: "select",
            placeholder: "Nationality",
            dynamicOptions: {
              url: "/countries",
              valueField: "id",
              labelField: "name",
            },
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
        `${temporaryDomain}/company-users/data-info`,
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
  return PersonalFormConfig;
};
