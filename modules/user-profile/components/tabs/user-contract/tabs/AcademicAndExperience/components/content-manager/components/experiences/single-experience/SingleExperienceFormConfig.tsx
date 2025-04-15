import { FormConfig } from "@/modules/form-builder";
import { apiClient } from "@/config/axios-config";
import { serialize } from "object-to-formdata";

export const SingleExperienceFormConfig = () => {

  const singleExperienceFormConfig: FormConfig = {
    formId: "user-experiences-data-form",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "job_title",
            label: "المسمى الوظيفي",
            type: "text",
            placeholder: "المسمى الوظيفي",
            validation: [
              {
                type: "required",
                message: "المسمى الوظيفي مطلوب",
              },
            ],
          },
          {
            label: "تاريخ البداية",
            type: "date",
            name: "start_date",
            placeholder: "تاريخ البداية",
            validation: [
              {
                type: "required",
                message: "تاريخ البداية مطلوب",
              },
            ],
          },
          {
            label: "تاريخ الانتهاء",
            type: "date",
            name: "end_date",
            placeholder: "تاريخ الانتهاء",
            validation: [
              {
                type: "required",
                message: "تاريخ الأنتهاء مطلوب",
              },
            ],
          },
          {
            name: "company_name",
            label: "اسم الشركة",
            type: "text",
            placeholder: "اسم الشركة",
            validation: [
              {
                type: "required",
                message: "اسم الشركة مطلوب",
              },
            ],
          },
          {
            name: "summary",
            label: "نبذه عن المشاريع والاعمال",
            type: "text",
            placeholder: "نبذه عن المشاريع والاعمال",
            validation: [
              {
                type: "required",
                message: "نبذه عن المشاريع والاعمال مطلوب",
              },
            ],
          },
        ],
      },
    ],
    initialValues: {},
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData: Record<string, unknown>) => {
      // format date yyyy-mm-dd
      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0"); // Months are 0-based
        const day = `${date.getDate()}`.padStart(2, "0");

        return `${year}-${month}-${day}`;
      };
      const startDate = new Date(formData?.identity_start_date as string);
      const endDate = new Date(formData?.identity_end_date as string);

      const body = {
        ...formData,
        identity_start_date: formatDate(startDate),
        identity_end_date: formatDate(endDate),
      };

      const response = await apiClient.post(
        `/company-users/identity-data`,
        serialize(body)
      );
      return {
        success: true,
        message: response.data?.message || "Form submitted successfully",
        data: response.data || {},
      };
    },
  };
  return singleExperienceFormConfig;
};
