import { FormConfig } from "@/modules/form-builder";
import { apiClient, baseURL } from "@/config/axios-config";
import { usePersonalDataTabCxt } from "../../../../../../../context/PersonalDataCxt";
import { serialize } from "object-to-formdata";

export const IdentityDataFormConfig = () => {
  const { userIdentityData } = usePersonalDataTabCxt();

  console.log("userIdentityData", userIdentityData);

  const IdentityFormConfig: FormConfig = {
    formId: "Identity-data-form",
    title: "بيانات الهوية",
    apiUrl: `${baseURL}/company-users/identity-data`,
    laravelValidation: {
      enabled: true,
      errorsPath: "errors",
    },
    sections: [
      {
        //  border_number,
        //  entry_number,
        //  file_border_number,
        //  file_entry_number,
        //  ,
        //  file_passport,
        //  passport,
        //  passport_start_date,
        //  ,
        //  border_number_start_date,
        //  entry_number_start_date,
        //  passport_end_date,
        //  ,
        //  border_number_end_date,
        //  entry_number_end_date,
        title: "بيانات الهوية",
        fields: [
          {
            name: "identity",
            label: "رقم رقم الهوية",
            type: "text",
            placeholder: "رقم رقم الهوية",
          },
          {
            label: "تاريخ الدخول",
            type: "date",
            name: "identity_start_date",
            placeholder: "تاريخ الدخول",
          },
          {
            label: "تاريخ الانتهاء",
            type: "date",
            name: "identity_end_date",
            placeholder: "تاريخ الانتهاء",
          },
          {
            label: "ارفاق الهوية",
            type: "image",
            name: "file_identity",
            placeholder: "رقم جواز السفر",
          },
        ],
      },
    ],
    initialValues: {
      identity: userIdentityData?.identity,
      identity_start_date: userIdentityData?.identity_start_date,
      identity_end_date: userIdentityData?.identity_end_date,
      file_identity: userIdentityData?.file_identity,
    },
    submitButtonText: "Submit",
    cancelButtonText: "Cancel",
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: true,
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
  return IdentityFormConfig;
};
