import { FormConfig } from "@/modules/form-builder";
import { apiClient } from "@/config/axios-config";
import { serialize } from "object-to-formdata";

export const UserCertificationFormConfig = () => {
  const userCertificationFormConfig: FormConfig = {
    formId: "user-certification-data-form",
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        fields: [
          {
            name: "authority_name",
            label: "اسم الجهة",
            type: "text",
            placeholder: "اسم الجهة",
            validation: [
              {
                type: "required",
                message: "اسم الجهة مطلوب",
              },
            ],
          },
          {
            name: "conformation_name",
            label: "اسم الاعتماد",
            type: "text",
            placeholder: "اسم الاعتماد",
            validation: [
              {
                type: "required",
                message: "اسم الاعتماد مطلوب",
              },
            ],
          },
          {
            name: "confirmation_number",
            label: "رقم الاعتماد",
            type: "text",
            placeholder: "رقم الاعتماد ",
            validation: [
              {
                type: "required",
                message: "رقم الاعتماد  مطلوب",
              },
            ],
          },
          {
            name: "conformation_degree",
            label: "درجة الاعتماد",
            type: "text",
            placeholder: "درجة الاعتماد",
            validation: [
              {
                type: "required",
                message: "درجة الاعتماد مطلوب",
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
  return userCertificationFormConfig;
};
