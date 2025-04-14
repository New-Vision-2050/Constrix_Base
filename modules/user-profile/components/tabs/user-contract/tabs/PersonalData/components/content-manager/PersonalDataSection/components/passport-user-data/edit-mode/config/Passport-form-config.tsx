import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../../context/PersonalDataCxt";
import { serialize } from "object-to-formdata";

export const PassportDataFormConfig = () => {
  const { userIdentityData } = usePersonalDataTabCxt();

  const PassportFormConfig: FormConfig = {
    formId: "Passport-data-form",
    title: "بيانات جواز السفر",
    apiUrl: `${baseURL}/company-users/contact-info`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        title: "بيانات جواز السفر",
        fields: [
          {
            name: "passport",
            label: "رقم جواز السغر",
            type: "text",
            placeholder: "رقم جواز السغر",
          },
          {
            label: "تاريخ الأستلام",
            type: "date",
            name: "passport_start_date",
            placeholder: "تاريخ الأستلام",
          },
          {
            label: "تاريخ الأنتهاء",
            type: "date",
            name: "passport_end_date",
            placeholder: "تاريخ الأنتهاء",
          },
          {
            label: "ارفاق الهوية",
            type: "image",
            isMulti: true,
            name: "file_passport",
            placeholder: "ارفاق الهوية",
          },
        ],
      },
    ],
    initialValues: {
      passport: userIdentityData?.passport,
      passport_start_date: userIdentityData?.passport_start_date,
      passport_end_date: userIdentityData?.passport_end_date,
    },
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSubmit: async (formData: Record<string, unknown>) => {
      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0"); // Months are 0-based
        const day = `${date.getDate()}`.padStart(2, "0");

        return `${year}-${month}-${day}`;
      };
      const startDate = new Date(formData?.passport_start_date as string);
      const endDate = new Date(formData?.passport_end_date as string);

      const body = {
        ...formData,
        passport_start_date: formatDate(startDate),
        passport_end_date: formatDate(endDate),
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
  return PassportFormConfig;
};
