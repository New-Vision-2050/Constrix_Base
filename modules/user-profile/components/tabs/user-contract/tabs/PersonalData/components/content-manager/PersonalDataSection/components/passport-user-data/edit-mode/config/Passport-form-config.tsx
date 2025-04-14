import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../../context/PersonalDataCxt";

export const PassportDataFormConfig = () => {
  const { userIdentityData } = usePersonalDataTabCxt();
  console.log('userIdentityData',userIdentityData)

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
            name: "passportNumber",
            label: "رقم جواز السغر",
            type: "text",
            placeholder: "رقم جواز السغر",
          },
          {
            label: "تاريخ الأستلام",
            type: "date",
            name: "dateOfReceipt",
            placeholder: "تاريخ الأستلام",
          },
          {
            label: "تاريخ الأنتهاء",
            type: "date",
            name: "endDate",
            placeholder: "تاريخ الأنتهاء",
          },
          {
            label: "ارفاق الهوية",
            type: "image",
            name: "passport",
            placeholder: "ارفاق الهوية",
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
  };
  return PassportFormConfig;
};
