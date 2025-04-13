import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";

export const PersonalDataFormConfig = () => {
  const PersonalFormConfig: FormConfig = {
    formId: "personal-data-form",
    title: "البيانات الشخصية",
    apiUrl: `${baseURL}/company-users/data-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "name",
            label: "الاسم ثلاثي",
            type: "text",
            placeholder: "Name",
          },
          {
            name: "nickname",
            label: "اسم الشهرة",
            type: "text",
            placeholder: "nick name",
          },
          {
            name: "gender",
            label: "الجنس",
            type: "select",
            placeholder: "Gender",
            options: [
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
            ],
          },
          {
            name: "is_default",
            label: "افتراضي ؟",
            type: "checkbox",
            placeholder: "Is Default?",
          },
          {
            name: "birthdate_gregorian",
            label: "تاريخ الميلاد",
            type: "date",
            placeholder: "Birthdate Gregorian",
          },
          {
            name: "birthdate_hijri",
            label: "تاريخ الهجري",
            type: "date",
            placeholder: "Birthdate Hijri",
          },
          {
            name: "nationality",
            label: "الجنسية",
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
        is_default: formData?.is_default ? 1 : 0,
      };
      const response = await apiClient.put(`/company-users/data-info`, body);
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
