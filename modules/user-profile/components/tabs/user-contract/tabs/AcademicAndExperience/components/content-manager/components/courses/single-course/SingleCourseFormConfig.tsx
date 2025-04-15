import { FormConfig } from "@/modules/form-builder";
import { apiClient } from "@/config/axios-config";
import { serialize } from "object-to-formdata";

export const SingleCourseFormConfig = () => {
  const singleCourseFormConfig: FormConfig = {
    formId: "user-courses-data-form",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
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
            name: "authority",
            label: "الجهة",
            type: "text",
            placeholder: "الجهة",
            validation: [
              {
                type: "required",
                message: "الجهة مطلوب",
              },
            ],
          },
          {
            name: "course_name",
            label: "اسم الدورة التدريبية ",
            type: "text",
            placeholder: "اسم الدورة التدريبية ",
            validation: [
              {
                type: "required",
                message: "اسم الدورة التدريبية  مطلوب",
              },
            ],
          },
          {
            name: "confirm_authority",
            label: "جهة الاعتماد",
            type: "text",
            placeholder: "جهة الاعتماد",
            validation: [
              {
                type: "required",
                message: "جهة الاعتماد مطلوب",
              },
            ],
          },
          {
            name: "certifications",
            label: "الشهادات الممنوحة",
            type: "text",
            placeholder: "الشهادات الممنوحة",
            validation: [
              {
                type: "required",
                message: "الشهادات الممنوحة مطلوب",
              },
            ],
          },
          {
            name: "certification_date_start",
            label: "تاريخ الحصول على الشهادة",
            type: "date",
            placeholder: "تاريخ الحصول على الشهادة",
            validation: [
              {
                type: "required",
                message: "تاريخ الحصول على الشهادة مطلوب",
              },
            ],
          },
          {
            name: "certification_date_end",
            label: "تاريخ انتهاء الشهادة",
            type: "date",
            placeholder: "تاريخ انتهاء الشهادة",
            validation: [
              {
                type: "required",
                message: "تاريخ انتهاء الشهادة مطلوب",
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
  return singleCourseFormConfig;
};
